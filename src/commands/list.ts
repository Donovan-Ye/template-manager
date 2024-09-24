import process from 'node:process'
import { Command } from 'commander'
import { geneDashLine } from '../utils/format'
import { getTemplateFile } from '../utils/git'
import { logger } from '../utils/logger'
import type { TemplatesArray } from '../types/templates'

function listTemplates(templates: TemplatesArray): void {
  if (templates.length === 0) {
    logger.warn('No templates found, you can add templates by using `tm add <template-name> <template-path>`')
    process.exit(1)
  }

  const length = Math.max(...templates.map(template => template.name.length)) + 3

  const messages = templates.map((template) => {
    return `${template.name}${geneDashLine(template.name, length)}${template.path}`
  })

  logger.log(`${messages.join('\n')}`)
}

export const list = new Command()
  .name('list')
  .alias('ls')
  .option('-f, --force', 'Force to get templates from the template repository')
  .description('List all available templates from your template repository, will be cached for 1 hour. You can use -f to force to get templates from the template repository.')
  .action(async ({ force }) => {
    const templates = await getTemplateFile({ force })
    listTemplates(templates)
  })
