import { logger } from '@/utils/logger'
import { Command } from 'commander'
import prompts from 'prompts'
import { cloneTemplate, getTemplateFile } from '../tools/git'
import type { Template } from '../types/templates'

export const create = new Command()
  .name('create')
  .argument('[path]', 'The path to create the project')
  .description('Choose a template to create a new project.')
  .action(async (path?: string) => {
    const templates = await getTemplateFile()

    const { template }: { template: Template } = await prompts({
      type: 'select',
      name: 'template',
      message: 'Choose a template to create a new project.',
      choices: templates.map(template => ({
        title: template.name,
        description: template.path,
        value: template,
      })),
      initial: 0,
    })

    const localPath = path ?? `./${template.name}`
    await cloneTemplate(template.path, localPath)

    logger.success(`\nProject created successfully in ${localPath}.`)
  })
