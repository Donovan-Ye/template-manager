#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import packageInfo from '../package.json'
import { add } from './commands/add'
import { create } from './commands/create'
import { init } from './commands/init'
import { list } from './commands/list'
import { open } from './commands/open'
import { pull } from './commands/pull'
import { remove } from './commands/remove'
import { set } from './commands/set'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main(): Promise<void> {
  const program = new Command()
    .name('tm')
    .description(packageInfo.description!)
    .version(
      packageInfo.version!,
      '-v, --version',
      'display the version number',
    )

  program
    .addCommand(init)
    .addCommand(add)
    .addCommand(list)
    .addCommand(set)
    .addCommand(remove)
    .addCommand(open)
    .addCommand(create)
    .addCommand(pull)

  program.parse()
}

main()
