import { logger } from '@/utils/logger'
import { Command } from 'commander'
import prompts from 'prompts'
import { cloneTemplate } from '../tools/git'
import { selectTemplatePrompt } from '../tools/selectTemplatePrompt'

export const pull = new Command()
  .name('pull')
  .description('Pull a template from the remote repository.')
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
