import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import simpleGit from 'simple-git'
import { TEMP_REMO_LOCAL_PATH, TM_FILE_NAME, TM_README, TM_README_END, TM_README_START, TM_REPO_GIT } from '../constants'
import { getConfig, updateExpirationTime } from './config'
import { parseJsonSafely } from './json'
import { logger } from './logger'
import type { TemplatesArray } from '../types/templates'

/**
 * If the repository path is a SSH path, convert it to the URL.
 * @param repoPath - The repository path, ssh or http(s) path.
 * @returns The URL.
 */
export function repoPathToUrl(repoPath: string): string {
  if (repoPath.startsWith('git@')) {
    const regex = /^(git@[^:]+):(.*)\.git$/
    const matchRes = repoPath.match(regex)
    if (!matchRes) {
      logger.error(`Failed to match the SSH path ${repoPath}`)
      process.exit(1)
    }
    const [, host, path] = matchRes
    return `https://${host}/${path}`
  }
  else if (repoPath.startsWith('http')) {
    return repoPath
  }
  return ''
}

/**
 * Remove the .git directory from the local path.
 * @param localPath - The local path to remove the .git directory from.
 */
export async function rmGit(localPath: string): Promise<void> {
  fs.rmSync(path.join(localPath, '.git'), { recursive: true, force: true })
}

/**
 * Remove the local template repository.
 */
export async function rmLocalTemplateRepo(): Promise<void> {
  fs.rmSync(TEMP_REMO_LOCAL_PATH, { recursive: true, force: true })
}

export async function initGitRepo(repoPath: string, remoteUrl?: string): Promise<void> {
  const git = simpleGit(repoPath)
  await git.init()
  await git.add('.')
  await git.commit('Initial commit')

  if (remoteUrl) {
    try {
      await git.remote(['add', 'origin', remoteUrl])
      await git.push(['-u', 'origin', 'main'])
    }
    catch (error) {
      logger.error(`${error}`)

      logger.warn(`Or you can also manually operate the repository at ${repoPath}.`)
      process.exit(1)
    }
  }
}

export async function cloneTemplate(repoPath: string, localPath: string, clean: boolean = false): Promise<void> {
  try {
    const git = simpleGit()
    await git.clone(repoPath, localPath)
    if (clean) {
      await rmGit(localPath)
      await initGitRepo(localPath)
    }
  }
  catch (error) {
    logger.error(`${error}`)
    process.exit(1)
  }
}

export interface TemplateOptions {
  force?: boolean
  includeHome?: boolean
}

export async function getTemplateFile({ force, includeHome }: TemplateOptions = {}): Promise<TemplatesArray> {
  // check if the templates are expired
  const { templatesExpirationTime } = await getConfig()
  const isExpired = new Date().getTime() > new Date(templatesExpirationTime ?? '').getTime()

  // read the repository from the local path
  let templateRepository = fs.readdirSync(TEMP_REMO_LOCAL_PATH)

  // if template repository is not in local or is expired or force is true, clone the repository from the remote repository
  if (!templateRepository || isExpired || force) {
    if (!TM_REPO_GIT) {
      logger.warn(
        'TM_REPO_GIT is not set. Please set the TM_REPO_GIT environment variable or run `init` command to initialize the template repository.\n'
        + 'You can find more information about this variable in the README.md file.',
      )
      process.exit(1)
    }

    logger.info(`Getting templates from ${TM_REPO_GIT}...\n`)

    if (templateRepository) {
      await rmLocalTemplateRepo()
    }

    await cloneTemplate(TM_REPO_GIT, TEMP_REMO_LOCAL_PATH)
    templateRepository = fs.readdirSync(TEMP_REMO_LOCAL_PATH)

    updateExpirationTime()
  }

  const templateFile = templateRepository.find(file => file === TM_FILE_NAME)

  if (!templateFile) {
    logger.error(`Template file ${TM_FILE_NAME} not found in the template repository.`)
    process.exit(1)
  }

  const content = fs.readFileSync(path.join(TEMP_REMO_LOCAL_PATH, templateFile), 'utf-8')
  const templates = parseJsonSafely(content) as TemplatesArray

  if (includeHome) {
    templates.unshift({
      name: 'Home',
      path: TM_REPO_GIT ?? '',
    })
  }

  return templates
}

export async function updateTemplateFile(newTemplates: TemplatesArray, commitMessage: string): Promise<void> {
  const git = simpleGit(TEMP_REMO_LOCAL_PATH)

  // update the templates file
  fs.writeFileSync(path.join(TEMP_REMO_LOCAL_PATH, TM_FILE_NAME), JSON.stringify(newTemplates, null, 2))

  // update the README.md file
  let readmeContent = fs.readFileSync(path.join(TEMP_REMO_LOCAL_PATH, TM_README), 'utf-8')
  const regex = new RegExp(`${TM_README_START}([\\s\\S]*)${TM_README_END}`)
  const matchRes = readmeContent.match(regex)

  const templatesMd = `${TM_README_START}\n\n${newTemplates.map(template => `- [${template.name}](${repoPathToUrl(template.path)})`).join('\n')}\n\n${TM_README_END}`
  if (!matchRes) {
    logger.error(`Failed to match the content between ${TM_README_START} and ${TM_README_END} in the README.md file.\n`
    + 'Will append the new templates to the end of the README.md file.')

    readmeContent += templatesMd
  }
  else {
    const originTmList = `${TM_README_START}${matchRes[1]}${TM_README_END}`
    readmeContent = readmeContent.replace(originTmList, templatesMd)
  }
  fs.writeFileSync(path.join(TEMP_REMO_LOCAL_PATH, TM_README), readmeContent)

  await git.add('.')
  await git.commit(commitMessage)
  await git.push()

  updateExpirationTime()
}
