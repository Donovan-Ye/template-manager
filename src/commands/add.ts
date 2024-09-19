import { logger } from '@/utils/logger'
import { Command } from 'commander'
import { getTemplateFile, updateTemplateFile } from '../tools/git'

export const add = new Command()
  .name('add')
  .argument('<template>', 'The template to add')
  .argument('<path>', 'The path to set the template')
  .description('Add a new template')
  .action(async (template, path) => {
    const templates = await getTemplateFile()
    templates.push({ name: template, path })

    logger.info(`Adding new template ${template} with path ${path}...\n`)
    await updateTemplateFile(templates, `add: add new template ${template} with path ${path}`)

    logger.success(`Template added successfully. Use \`list\` to see the updated templates.`)
  })
