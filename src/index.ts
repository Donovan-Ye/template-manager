#!/usr/bin/env node

import process from 'node:process'
import { Command } from 'commander'
import { getPackageInfo } from '../utils/get-package-info'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

async function main(): Promise<void> {
  const packageInfo = getPackageInfo()

  const program = new Command()
    .name(packageInfo.name!)
    .description(packageInfo.description!)
    .version(
      packageInfo.version!,
      '-v, --version',
      'display the version number',
    )

  // program.addCommand(init).addCommand(add).addCommand(diff).addCommand(pull).addCommand(push).addCommand(pushBusiness)

  program.parse()
}

main()
