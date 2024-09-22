import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ini from 'ini'
import { EXPIRATION_TIME, HOME, TMRC } from '../constants'
import { parseObjectValue, stringifyObjectValue } from './json'
import { logger } from './logger'
import type { Config } from '../types/config'

const defaultConfig: Config = {
  templatesExpirationTime: new Date().toISOString(),
}

let config: Config | undefined

export async function getConfig(): Promise<Config> {
  config = Object.assign(
    {},
    defaultConfig,
    fs.existsSync(TMRC)
      ? parseObjectValue(ini.parse(fs.readFileSync(TMRC, 'utf-8')))
      : null,
  )

  return config
}

export function updateConfig(newConfig: Config): void {
  config = { ...config, ...newConfig }

  fs.writeFileSync(TMRC, ini.stringify(stringifyObjectValue(config)))
}

/**
 * Update the templates expiration time to ${EXPIRATION_TIME} hours
 */
export function updateExpirationTime(): void {
  updateConfig({ templatesExpirationTime: new Date(new Date().getTime() + EXPIRATION_TIME).toISOString() })
}

export function updateRCFileNotInWindows(key: string, value: string): void {
  const rcFile = path.join(HOME, process.platform === 'darwin' ? '.zshrc' : '.bashrc')
  const hint = `'Please run 'source ${rcFile}' to make it work in current shell, or restart your shell.`

  const rcContent = fs.readFileSync(rcFile, 'utf-8')
  if (rcContent.includes(`export ${key}`)) {
    logger.warn(`${value} is already in ${rcFile}. ${hint}`)
    return
  }

  execSync(`echo 'export ${key}=${value}' >> ${rcFile}`)
  execSync(`source ${rcFile}`)
  logger.warn(`${value} has been added to ${rcFile}. ${hint}`)
}

/**
 * Update the env variable in different platforms
 * @param key - The key of the env variable
 * @param value - The value of the env variable
 */
export function updateEnvVariable(key: string, value: string): void {
  switch (process.platform) {
    case 'darwin':
    case 'linux':
    {
      updateRCFileNotInWindows(key, value)
      break
    }
    case 'win32':
    {
      execSync(`setx ${key} "${value}" /M`)
      break
    }
    default:
      throw new Error('Unsupported platform')
  }
}
