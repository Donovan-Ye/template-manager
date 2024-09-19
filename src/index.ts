#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import packageInfo from '../package.json'
import { add } from './commands/add'
import { create } from './commands/create'
import { list } from './commands/list'
import { set } from './commands/set'

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

  program
    .addCommand(list)
    .addCommand(set)
    .addCommand(add)
    .addCommand(create)

  program.parse()
}

main()
