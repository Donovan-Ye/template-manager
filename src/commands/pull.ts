import { Command } from 'commander'
import prompts from 'prompts'
import { cloneTemplate } from '../utils/git'
import { logger } from '../utils/logger'
import { selectTemplatePrompt } from '../utils/selectTemplatePrompt'

export const pull = new Command()
  .name('pull')
  .description('Pull a template from the remote repository, all the git history will be preserved.')
  .action(async () => {
    const template = await selectTemplatePrompt()

    const { path }: { path: string } = await prompts({
      type: 'text',
      name: 'path',
      message: 'Enter the path to pull the template',
      initial: `./${template.name}`,
    })

    const localPath = path ?? `./${template.name}`
    await cloneTemplate(template.path, localPath)

    logger.success(`\nTemplate pulled successfully in ${localPath}.`)
  })
