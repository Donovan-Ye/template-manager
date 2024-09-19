import { logger } from '@/utils/logger'
import { Command } from 'commander'
import { getConfig, updateConfig } from '../config'

export const set = new Command()
  .name('set')
  .argument('<template>', 'The template to set')
  .argument('<path>', 'The path to set the template')
  .description('Set a template to a path')
  .action(async (template, path) => {
    const { templates } = await getConfig()
    const newTemplates = { ...templates, [template]: path }

    updateConfig({ templates: newTemplates })
    logger.info(`Template ${template} set to ${path}`)
  })
