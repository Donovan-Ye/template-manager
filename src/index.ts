#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import packageInfo from '../package.json'
import { init } from './commands/init'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main(): Promise<void> {
  const program = new Command()
    .name('@meta-carbon/mpm')
    .description(packageInfo.description!)
    .version(
      packageInfo.version!,
      '-v, --version',
      '展示版本号',
    )
    .helpOption('-h, --help', '展示帮助信息')

  program
    .addCommand(init)
    .helpCommand('help', '展示帮助信息')

  program.parse()
}

main()
