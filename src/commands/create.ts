import { Command } from 'commander'
import prompts from 'prompts'
import { cloneTemplate } from '../utils/git'
import { logger } from '../utils/logger'
import { selectTemplatePrompt } from '../utils/selectTemplatePrompt'

export const create = new Command()
  .name('create')
  .description('Choose a template to create a new project, all the git history will be removed.')
  .action(async () => {
    const template = await selectTemplatePrompt()

    const { path }: { path: string } = await prompts({
      type: 'text',
      name: 'path',
      message: 'Enter the path to create the project',
      initial: `./${template.name}`,
    })

    const localPath = path ?? `./${template.name}`
    await cloneTemplate(template.path, localPath, true)

    logger.success(`\nProject created successfully in ${localPath}.`)
  })
