import process from 'node:process'
import { Command } from 'commander'
import openUrl from 'open'
import { repoPathToUrl } from '../utils/git'
import { logger } from '../utils/logger'
import { selectTemplatePrompt } from '../utils/selectTemplatePrompt'

export const open = new Command()
  .name('open')
  .description('Choose a template to open in the browser.')
  .action(async () => {
    const template = await selectTemplatePrompt({ includeHome: true })

    const path = repoPathToUrl(template.path)
    if (!path.startsWith('http')) {
      logger.error('It seems that the path is not a valid URL, please check it and try again.')
      process.exit(1)
    }

    // open the path in the browser
    await openUrl(path)
  })
