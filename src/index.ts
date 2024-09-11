#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import packageInfo from '../package.json'
import { list } from './commands/list'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main(): Promise<void> {
  const program = new Command()
    .name(packageInfo.name!)
    .description(packageInfo.description!)
    .version(
      packageInfo.version!,
      '-v, --version',
      'display the version number',
    )

  program.addCommand(list)

  program.parse()
}

main()
