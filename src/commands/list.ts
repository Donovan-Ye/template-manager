import fs from 'node:fs'
import process from 'node:process'
import { geneDashLine } from '@/utils/format'
import { logger } from '@/utils/logger'
import { Command } from 'commander'
import simpleGit from 'simple-git'
import { getConfig, updateConfig } from '../config'
import { EXPIRATION_TIME, TEMP_REPO_NAME, TEMPLATE_FILE_NAME } from '../constants'
import type { TemplatesArray } from '../types/templates'

const templateRepositoryPath = process.env.TEMPLATE_REPOSITORY_PATH

function listTemplates(templates: TemplatesArray[]): void {
  const length = Math.max(...templates.map(template => template.name.length)) + 3

  const messages = templates.map((template) => {
    return `${template.name}${geneDashLine(template.name, length)}${template.path}`
  })

  logger.log(messages.join('\n'))
}

export const list = new Command()
  .name('list')
  .option('-f, --force', 'Force to get templates from the template repository')
  .description('List all available templates from your template repository, will be cached for 1 hour. You can use -f to force to get templates from the template repository.')
  .action(async ({ force }) => {
    if (!templateRepositoryPath) {
      logger.warn(
        'TEMPLATE_REPOSITORY_PATH is not set. Please set the TEMPLATE_REPOSITORY_PATH environment variable.\n'
        + 'TEMPLATE_REPOSITORY_PATH is git path to the directory with templates info.\n'
        + 'You can find more information about this variable in the README.md file.',
      )
      process.exit(1)
    }

    const { templates: cachedTemplates, templatesExpirationTime } = await getConfig()
    let templates: TemplatesArray[] = cachedTemplates
    const isExpired = new Date().getTime() > new Date(templatesExpirationTime).getTime()

    if (force || isExpired) {
      logger.info(`Getting templates from ${templateRepositoryPath}...\n`)

      const git = simpleGit()
      await git.clone(templateRepositoryPath, TEMP_REPO_NAME)
      const templateRepository = fs.readdirSync(TEMP_REPO_NAME)
      const templateFile = templateRepository.find(file => file === TEMPLATE_FILE_NAME)

      if (!templateFile) {
        logger.error(`Template file ${TEMPLATE_FILE_NAME} not found in the template repository.`)
      }
      else {
        const templateFileContent = fs.readFileSync(`${TEMP_REPO_NAME}/${templateFile}`, 'utf8')
        templates = JSON.parse(templateFileContent) as TemplatesArray[]
        updateConfig({ templates, templatesExpirationTime: new Date(Date.now() + EXPIRATION_TIME).toISOString() })
      }

      // clean up
      fs.rmSync(TEMP_REPO_NAME, { recursive: true, force: true })
    }

    listTemplates(templates)
  })
