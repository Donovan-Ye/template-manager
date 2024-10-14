import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ini from 'ini'
import { EXPIRATION_TIME, HOME, TEMP_REMO_LOCAL_PATH_PREFIX, TMRC } from '../constants'
import { parseObjectValue, stringifyObjectValue } from './json'
import { logger } from './logger'
import type { Config, RemoteSource, RemoteSourceData } from '../types/config'

export async function getConfig(): Promise<Config> {
  const config = Object.assign(
    {},
    fs.existsSync(TMRC)
      ? parseObjectValue(ini.parse(fs.readFileSync(TMRC, 'utf-8')))
      : null,
  )

  return config
}

export async function updateConfig(newConfig: Config): Promise<void> {
  const config = await getConfig()

  fs.writeFileSync(TMRC, ini.stringify(stringifyObjectValue({ ...config, ...newConfig })))
}

/**
 * Get all remote template sources
 */
export async function getRemoteSources(): Promise<RemoteSource> {
  const config = await getConfig()
  return config.remoteSources || {}
}

/**
 * Get the current remote source and its data
 */
export async function getCurrentRemoteSource(): Promise<{ currentRemoteSource: string, remoteSourceData: RemoteSourceData }>
export async function getCurrentRemoteSource({ warning }: { warning: boolean }): Promise<{ currentRemoteSource?: string, remoteSourceData?: RemoteSourceData }>
export async function getCurrentRemoteSource(...args: [{ warning: boolean }?]): Promise<unknown> {
  const { currentRemoteSource, remoteSources } = await getConfig()
  const warning = args[0]?.warning ?? true
  if ((!currentRemoteSource || !remoteSources?.[currentRemoteSource])) {
    if (warning) {
      logger.error('No current remote template source found, please run `tm remote use <name>` to set the current remote template source.')
      process.exit(0)
    }
    return {
      currentRemoteSource,
      remoteSourceData: currentRemoteSource ? remoteSources?.[currentRemoteSource] : undefined,
    }
  }

  return {
    currentRemoteSource,
    remoteSourceData: remoteSources[currentRemoteSource],
  }
}

/**
 * Update remote template sources
 */
export async function updateRemoteSources(sources: RemoteSource): Promise<void> {
  const config = await getConfig()
  config.remoteSources = sources
  updateConfig(config)
}

/**
 * Get the local path of the template repository with the current remote source
 */
export async function getLocalPathWithCurrentRemoteSource(): Promise<string> {
  const { currentRemoteSource } = await getCurrentRemoteSource()

  return path.join(TEMP_REMO_LOCAL_PATH_PREFIX, currentRemoteSource)
}

/**
 * Get the local path of the template repository
 */
export function getLocalPath(remoteSource: string): string {
  return path.join(TEMP_REMO_LOCAL_PATH_PREFIX, remoteSource)
}

/**
 * Update the templates expiration time to ${EXPIRATION_TIME} hours
 */
export async function updateExpirationTime(name: string): Promise<void> {
  const remoteSource = await getRemoteSources()

  updateConfig({
    remoteSources: {
      ...remoteSource,
      [name]: {
        ...remoteSource[name],
        expirationTime: new Date(new Date().getTime() + EXPIRATION_TIME).toISOString(),
      },
    },
  })
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
