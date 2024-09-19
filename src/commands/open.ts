import process from 'node:process'
import { logger } from '@/utils/logger'
import { Command } from 'commander'
import openUrl from 'open'
import prompts from 'prompts'
import { getTemplateFile } from '../tools/git'
import type { Template } from '../types/templates'

export const open = new Command()
  .name('open')
  .description('Choose a template to open.')
  .action(async () => {
    const templates = await getTemplateFile({ includeHome: true })

    const { template }: { template: Template } = await prompts({
      type: 'select',
      name: 'template',
      message: 'Choose a template to open.',
      choices: templates.map(template => ({
        title: template.name,
        description: template.path,
        value: template,
      })),
      initial: 0,
    })

    let path = template.path
    if (path.startsWith('git@')) {
      path = `https://github.com/${path.split(':')[1]}`
    }
    else if (!path.startsWith('http')) {
      logger.error('It seems that the path is not a valid URL, please check it and try again.')
      process.exit(1)
    }

    // open the path in the browser
    await openUrl(path)
  })
