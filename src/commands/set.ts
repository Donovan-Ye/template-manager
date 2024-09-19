import process from 'node:process'
import { logger } from '@/utils/logger'
import { Command } from 'commander'
import { getTemplateFile, updateTemplateFile } from '../tools/git'

export const set = new Command()
  .name('set')
  .argument('<template>', 'The template to set')
  .argument('<path>', 'The path to set the template')
  .description('Set a template to a path')
  .action(async (template, path) => {
    const templates = await getTemplateFile()
    const index = templates.findIndex(t => t.name === template)
    if (index === -1) {
      logger.error(`Template ${template} not found`)
      process.exit(1)
    }
    templates[index].path = path

    logger.info(`Updating template '${template}' to '${path}'...\n`)
    await updateTemplateFile(templates, `set: update template '${template}' to '${path}'`)

    logger.success(`Template updated successfully. Use \`list\` to see the updated templates.`)
  })
