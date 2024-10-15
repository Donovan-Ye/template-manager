import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import prompts from 'prompts'
import { README_INIT_CONTENT, TM_FILE_INIT_CONTENT, TM_FILE_NAME, TM_README } from '../constants'
import { getCurrentRemoteSource, getLocalPathWithCurrentRemoteSource } from '../utils/config'
import { cloneTemplate, pushGitRepo } from '../utils/git'
import { logger } from '../utils/logger'

export const init = new Command()
  .name('init')
  .description('Initialize current remote source repository with initial files.')
  .option('-f, --force', 'Force overwrite the existing templates repository.')
  .action(async ({ force }: { force: boolean }) => {
    const localPath = await getLocalPathWithCurrentRemoteSource()

    if (!fs.existsSync(localPath)) {
      const { remoteSourceData } = await getCurrentRemoteSource()
      const { url: remoteUrl } = remoteSourceData
      await cloneTemplate(remoteUrl, localPath)
    }

    const filesWillBeChecked = [
      {
        file: path.join(localPath, TM_FILE_NAME),
        initialContent: TM_FILE_INIT_CONTENT,
      },
      {
        file: path.join(localPath, TM_README),
        initialContent: README_INIT_CONTENT,
      },
    ]

    for (const { file, initialContent } of filesWillBeChecked) {
      let overwrite = true
      if (fs.existsSync(file)) {
        if (!force) {
          const { overwrite: overwriteConfirm } = await prompts([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `It seems that the ${file} already exists. \n`
              + 'Do you want to overwrite it?',
              initial: true,
            },
          ])

          overwrite = overwriteConfirm
        }
      }

      if (overwrite) {
        fs.rmSync(file, { force: true, recursive: true })
        fs.writeFileSync(file, initialContent, {
          flag: 'wx',
        })
      }
      else {
        logger.warn(`Initialization cancelled.`)
        process.exit(0)
      }
    }

    await pushGitRepo(localPath, 'Init templates repository.')

    logger.success(`Templates repository initialized successfully in ${localPath}.`)
  })
