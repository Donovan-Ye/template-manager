import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Command } from 'commander'
import prompts from 'prompts'
import { README_INIT_CONTENT, TEMP_REMO_LOCAL_PATH, TM_FILE_INIT_CONTENT, TM_FILE_NAME, TM_README, TM_REPO_GIT } from '../constants'
import { updateConfig, updateEnvVariable } from '../utils/config'
import { rmLocalTemplateRepo } from '../utils/git'
import { logger } from '../utils/logger'

export const init = new Command()
  .name('init')
  .description('Initialize a new templates repository to manage templates.')
  .action(async () => {
    if (TM_REPO_GIT) {
      logger.warn(
        `It seems env variable 'TM_REPO_GIT' is already defined. Which is: ${TM_REPO_GIT}\n`
        + 'If you want to re-initialize it, please delete the existing one and run the command again.',
      )
      process.exit(1)
    }

    if (fs.existsSync(TEMP_REMO_LOCAL_PATH)) {
      const { overwrite } = await prompts([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `It seems that the templates repository already exists. Which is: ${TEMP_REMO_LOCAL_PATH}\n`
          + 'Do you want to overwrite it?',
          initial: true,
        },
      ])

      if (overwrite) {
        await rmLocalTemplateRepo()
      }
      else {
        logger.warn('Initialization cancelled.')
        process.exit(1)
      }
    }

    const { remoteUrl } = await prompts([
      {
        type: 'text',
        name: 'remoteUrl',
        message: 'Enter the remote repository URL to store and managetemplates information.',
      },
    ])

    if (!remoteUrl) {
      logger.error('Remote repository URL is required.')
      process.exit(1)
    }

    // create tm-repo and initial files
    fs.mkdirSync(TEMP_REMO_LOCAL_PATH)
    // if the file is not exist, create it
    fs.writeFileSync(path.join(TEMP_REMO_LOCAL_PATH, TM_README), README_INIT_CONTENT, {
      flag: 'wx',
    })
    fs.writeFileSync(path.join(TEMP_REMO_LOCAL_PATH, TM_FILE_NAME), TM_FILE_INIT_CONTENT, {
      flag: 'wx',
    })

    updateEnvVariable('TM_REPO_GIT', remoteUrl)
    updateConfig({ templatesExpirationTime: new Date(new Date().getTime()).toISOString() })
    // await initGitRepo(TEMP_REMO_LOCAL_PATH, remoteUrl)

    logger.success(`Templates repository initialized successfully in ${TEMP_REMO_LOCAL_PATH}.`)
  })
