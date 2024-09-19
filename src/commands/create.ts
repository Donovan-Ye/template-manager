import { logger } from '@/utils/logger'
import { Command } from 'commander'
import prompts from 'prompts'
import { cloneTemplate } from '../tools/git'
import { selectTemplatePrompt } from '../tools/selectTemplatePrompt'

export const create = new Command()
  .name('create')
  .description('Choose a template to create a new project.')
  .action(async () => {
    const template = await selectTemplatePrompt()

    const { path }: { path: string } = await prompts({
      type: 'text',
      name: 'path',
      message: 'Enter the path to create the project',
      initial: `./${template.name}`,
    })

    const localPath = path ?? `./${template.name}`
    await cloneTemplate(template.path, localPath)

    logger.success(`\nProject created successfully in ${localPath}.`)
  })
