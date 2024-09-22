import process from 'node:process'
import { Command } from 'commander'
import openUrl from 'open'
import { logger } from '../utils/logger'
import { selectTemplatePrompt } from '../utils/selectTemplatePrompt'

export const open = new Command()
  .name('open')
  .description('Choose a template to open.')
  .action(async () => {
    const template = await selectTemplatePrompt({ includeHome: true })

    let path = template.path
    if (path.startsWith('git@')) {
      path = `https://github.com/${path?.split(':')?.[1]}`
    }
    else if (!path.startsWith('http')) {
      logger.error('It seems that the path is not a valid URL, please check it and try again.')
      process.exit(1)
    }

    // open the path in the browser
    await openUrl(path)
  })
