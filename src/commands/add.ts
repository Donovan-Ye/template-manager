import process from 'node:process'
import { Command } from 'commander'
import { getTemplateFile, updateTemplateFile } from '../utils/git'
import { logger } from '../utils/logger'

export const add = new Command()
  .name('add')
  .argument('<template>', 'The template to add')
  .argument('<path>', 'The path to set the template')
  .description('Add a new template.')
  .action(async (template, path) => {
    const templates = await getTemplateFile()
    if (templates.some(t => t.name === template)) {
      logger.error(`Template '${template}' already exists.`)
      process.exit(1)
    }
    templates.push({ name: template, path })

    logger.info(`Adding new template '${template}' with path '${path}'...\n`)
    await updateTemplateFile(templates, `add: add new template '${template}' with path '${path}'`)

    logger.success(`Template added successfully. Use \`list\` to see the updated templates.`)
  })
