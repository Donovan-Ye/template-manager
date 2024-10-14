import { Command } from 'commander'
import { listFormattedContents } from '../utils/format'
import { getTemplateFile } from '../utils/git'

export const list = new Command()
  .name('list')
  .alias('ls')
  .option('-f, --force', 'Force to get templates from the template repository')
  .description('List all available templates from your template repository, will be cached for 1 hour. You can use -f to force to get templates from the template repository.')
  .action(async ({ force }) => {
    const templates = await getTemplateFile({ force })

    listFormattedContents(
      templates.map(template => ({ label: template.name, value: template.path })),
      {
        hintMessage: 'No templates found, you can add templates by using `tm add <template-name> <template-path>`',
      },
    )
  })
