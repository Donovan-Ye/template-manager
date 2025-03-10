import fs from 'node:fs'
import process from 'node:process'
import { Command } from 'commander'
import ini from 'ini'
import prompts from 'prompts'
import {
  NPMRC_PROJECT,
  PACKAGE_JSON_PROJECT,
  PUBLISH_CONFIG_KEY,
  REGISTRY_KEY_SCOPE,
  REGISTRY_VAL_SCOPE,
  UPDATING_NPMRC_CONFIG,
} from '../constants'
import { logger } from '../utils/logger'
import { updateNpmrc, updatePackageJson } from '../utils/updater'

export const init = new Command()
  .name('init')
  .description('初始化当前项目下的私有源的相关配置（.npmrc 和 package.json）')
  .option('-u, --update', '更新配置文件，仅更新registry, @scope:registry 和 publishConfig')
  .action(async ({ update }: { update: boolean }) => {
    const packageJson = fs.readFileSync(PACKAGE_JSON_PROJECT, 'utf-8')
    if (!packageJson) {
      logger.error('当前项目下没有 package.json 文件')
      process.exit(1)
    }

    const npmrcConfig = ini.parse(fs.readFileSync(NPMRC_PROJECT, 'utf-8')) || {}
    for (const { key, value } of UPDATING_NPMRC_CONFIG) {
      if (!npmrcConfig[key]) {
        logger.info(`当前项目的.npmrc 文件中没有 ${key} 配置，正在初始化...`)
        updateNpmrc(key, value)
      }
      else {
        let overwrite = update

        if (!update) {
          const { overwrite: overwriteConfirm } = await prompts([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `当前项目的.npmrc 文件中 ${key} 配置已存在，是否覆盖？`,
            },
          ])
          overwrite = overwriteConfirm as boolean
        }
        if (overwrite) {
          logger.info(`当前项目的.npmrc 文件中 ${key} 配置已存在，正在更新...`)
          updateNpmrc(key, value)
        }
      }
    }

    const packageJsonObj = JSON.parse(packageJson) || {}
    const publishConfig = packageJsonObj?.[PUBLISH_CONFIG_KEY] ?? {}

    if (!publishConfig?.[REGISTRY_KEY_SCOPE]) {
      logger.info('当前项目package.json 中没有publishConfig[@scope:registry]相关配置，正在初始化...')

      updatePackageJson(packageJsonObj, REGISTRY_KEY_SCOPE, REGISTRY_VAL_SCOPE)
    }
    else {
      let overwrite = update
      if (!update) {
        const { overwrite: overwriteConfirm } = await prompts([
          {
            type: 'confirm',
            name: 'overwrite',
            message: '当前项目package.json 中已存在publishConfig[@scope:registry]相关配置，是否覆盖？',
          },
        ])
        overwrite = overwriteConfirm as boolean
      }
      if (overwrite) {
        logger.info('当前项目package.json 中已存在publishConfig[@scope:registry]相关配置，正在更新...')
        updatePackageJson(packageJsonObj, REGISTRY_KEY_SCOPE, REGISTRY_VAL_SCOPE)
      }
    }

    logger.success('初始化完成, 请检查当前项目下的.npmrc 和 package.json 文件')
  })
