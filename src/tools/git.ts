import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parseJsonSafely } from '@/utils/json'
import { logger } from '@/utils/logger'
import simpleGit from 'simple-git'
import { getConfig, updateConfig } from '../config'
import { EXPIRATION_TIME, TEMP_REMO_LOCAL_PATH, TM_FILE_NAME, TM_REPO_GIT } from '../constants'
import type { TemplatesArray } from '../types/templates'

export async function getTemplateFile(force: boolean = false): Promise<TemplatesArray> {
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

    const git = simpleGit()
    await git.clone(TM_REPO_GIT, TEMP_REMO_LOCAL_PATH)
    templateRepository = fs.readdirSync(TEMP_REMO_LOCAL_PATH)
    // update the templates expiration time to 1 hour
    updateConfig({ templatesExpirationTime: new Date(new Date().getTime() + EXPIRATION_TIME).toISOString() })
  }

  const templateFile = templateRepository.find(file => file === TM_FILE_NAME)

  if (!templateFile) {
    logger.error(`Template file ${TM_FILE_NAME} not found in the template repository.`)
    process.exit(1)
  }

  const content = fs.readFileSync(path.join(TEMP_REMO_LOCAL_PATH, templateFile), 'utf-8')
  return parseJsonSafely(content) as TemplatesArray
}
