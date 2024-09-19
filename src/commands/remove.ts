import process from 'node:process'
import { logger } from '@/utils/logger'
import { Command } from 'commander'
import { getTemplateFile, updateTemplateFile } from '../tools/git'
import { selectTemplatePrompt } from '../tools/selectTemplatePrompt'

export const remove = new Command()
  .name('remove')
  .alias('rm')
  .argument('[template]', 'The template to remove')
  .description('Remove a template')
  .action(async (templateName) => {
    let selectedTemplateName = templateName
    if (!selectedTemplateName) {
      const template = await selectTemplatePrompt()
      selectedTemplateName = template.name
    }

    const templates = await getTemplateFile()
    const index = templates.findIndex(t => t.name === selectedTemplateName)
    if (index === -1) {
      logger.error(`Template '${selectedTemplateName}' not found`)
      process.exit(1)
    }

    templates.splice(index, 1)

    logger.info(`Removing template '${selectedTemplateName}'...\n`)
    await updateTemplateFile(templates, `remove: remove template '${selectedTemplateName}'`)

    logger.success(`Template removed successfully. Use \`list\` to see the updated templates.`)
  })
