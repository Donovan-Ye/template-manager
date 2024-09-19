import fs from 'node:fs'
import { parseObjectValue, stringifyObjectValue } from '@/utils/json'
import ini from 'ini'
import { TMRC } from './constants'
import type { Config } from './types/config'

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
