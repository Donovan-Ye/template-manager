import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseJsonSafely } from '@/utils/json'
import { logger } from '@/utils/logger'
import simpleGit from 'simple-git'
import { getConfig, updateExpirationTime } from '../config'
import { TEMP_REMO_LOCAL_PATH, TM_FILE_NAME, TM_REPO_GIT } from '../constants'
import type { TemplatesArray } from '../types/templates'

export async function cloneTemplate(repoPath: string, localPath: string): Promise<void> {
  try {
    const git = simpleGit()
    await git.clone(repoPath, localPath)
  }

  catch (error) {
    logger.error(`${error}`)
    process.exit(1)
  }
}

interface GetTemplateFileOptions {
  force?: boolean
  includeHome?: boolean
}

export async function getTemplateFile({ force, includeHome }: GetTemplateFileOptions = {}): Promise<TemplatesArray> {
  // check if the templates are expired
  const { templatesExpirationTime } = await getConfig()
  const isExpired = new Date().getTime() > new Date(templatesExpirationTime ?? '').getTime()

  // read the repository from the local path
  let templateRepository = fs.readdirSync(TEMP_REMO_LOCAL_PATH)

  // if template repository is not in local or is expired or force is true, clone the repository from the remote repository
  if (!templateRepository || isExpired || force) {
    if (!TM_REPO_GIT) {
      logger.warn(
        'TM_REPO_GIT is not set. Please set the TM_REPO_GIT environment variable.\n'
        + 'TM_REPO_GIT is git path to the directory with templates info.\n'
        + 'You can find more information about this variable in the README.md file.',
      )
      process.exit(1)
    }

    logger.info(`Getting templates from ${TM_REPO_GIT}...\n`)

    if (templateRepository) {
      fs.rmSync(TEMP_REMO_LOCAL_PATH, { recursive: true, force: true })
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

  fs.writeFileSync(path.join(TEMP_REMO_LOCAL_PATH, TM_FILE_NAME), JSON.stringify(newTemplates, null, 2))
  await git.add(TM_FILE_NAME)
  await git.commit(commitMessage)
  await git.push()

  updateExpirationTime()
}
