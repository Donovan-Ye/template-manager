import fs from 'node:fs'
import process from 'node:process'
import { Command } from 'commander'
import { getCurrentRemoteSource, getLocalPath, getRemoteSources, updateConfig, updateRemoteSources } from '../utils/config'
import { listFormattedContents } from '../utils/format'
import { logger } from '../utils/logger'

export const remoteListHintMessage = 'No remote template sources found, you can add remote template sources by using `tm remote add <name> <source-url>`'

export const remote = new Command()
  .name('remote')
  .description('Manage remote template sources')

const list = new Command()
  .name('list')
  .alias('ls')
  .description('List all remote template sources')
  .action(async () => {
    const sources = await getRemoteSources()
    const { currentRemoteSource } = await getCurrentRemoteSource({ warning: false })

    listFormattedContents(Object.entries(sources).map(([name, { url }]) => ({ label: name, value: url })), {
      hintMessage: remoteListHintMessage,
      selectedName: currentRemoteSource,
    })
  })

const add = new Command()
  .name('add')
  .description('Add a remote template source')
  .argument('<name>', 'The name of the remote template source')
  .argument('<source-url>', 'The URL of the remote template source')
  .action(async (name, sourceUrl) => {
    const sources = await getRemoteSources()
    if (sources[name]) {
      logger.error(`Remote template source '${name}' already exists`)
      process.exit(0)
    }

    await updateRemoteSources({
      ...sources,
      [name]: {
        url: sourceUrl,
        expirationTime: new Date().toISOString(),
      },
    })

    logger.success(`Remote template source '${name}' added successfully`)
  })

const use = new Command()
  .name('use')
  .description('Use a remote template source')
  .argument('<name>', 'The name of the remote template source')
  .action(async (name) => {
    const sources = await getRemoteSources()
    if (!sources[name]) {
      logger.error(`Remote template source '${name}' not found`)
      process.exit(0)
    }

    updateConfig({ currentRemoteSource: name })

    logger.success(`Switched to remote template source '${name}'`)
  })

const remove = new Command()
  .name('remove')
  .alias('rm')
  .description('Remove a remote template source')
  .argument('<name>', 'The name of the remote template source')
  .action(async (name) => {
    const sources = await getRemoteSources()
    if (!sources[name]) {
      logger.error(`Remote template source '${name}' not found`)
      process.exit(0)
    }

    const newSources = Object.fromEntries(Object.entries(sources).filter(([key]) => key !== name))
    const localPath = getLocalPath(name)
    if (fs.existsSync(localPath)) {
      fs.rmdirSync(localPath, { recursive: true })
    }
    await updateRemoteSources(newSources)

    logger.success(`Remote template source '${name}' removed successfully\n`)

    logger.info('Switching to the first remote template source...')
    const { currentRemoteSource } = await getCurrentRemoteSource()
    if (name === currentRemoteSource) {
      const firstSource = Object.keys(newSources)[0]
      if (!firstSource) {
        updateConfig({ currentRemoteSource: undefined })
        logger.warn('No remote template sources found, please run `tm remote add <name> <source-url>` to add a remote template source.')
        process.exit(0)
      }

      updateConfig({ currentRemoteSource: firstSource })
      logger.success(`Switched to remote template source '${firstSource}'`)
    }
  })

remote.addCommand(list).addCommand(add).addCommand(remove).addCommand(use)
