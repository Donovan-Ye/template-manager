import templatesJSON from '@/templates/templates.json'
import { logger } from '@/utils/logger'
import { Command } from 'commander'

export const list = new Command()
  .name('list')
  .description('List all  available templates.')
  .action(() => {
    logger.info('Available templates:', JSON.stringify(templatesJSON))
  })
