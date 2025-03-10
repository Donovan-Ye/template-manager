import path from 'node:path'
import process from 'node:process'

export const HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] || '~/'

export const NPMRC_PROJECT = path.join(process.cwd(), '.npmrc')

export const PACKAGE_JSON_PROJECT = path.join(process.cwd(), 'package.json')

export const REGISTRY_KEY = 'registry'
export const REGISTRY_KEY_SCOPE = '@meta-carbon:registry'
export const PUBLISH_CONFIG_KEY = 'publishConfig'

export const REGISTRY_VAL = 'https://registry.npmmirror.com'
export const REGISTRY_VAL_SCOPE = 'http://nexus.metac-inc.com/repository/npm-gourp/'
export const PUBLISH_VAL_SCOPE = 'http://nexus.metac-inc.com/repository/npm-hosted/'

export const UPDATING_NPMRC_CONFIG = [
  {
    key: REGISTRY_KEY_SCOPE,
    value: REGISTRY_VAL_SCOPE,
  },
  {
    key: REGISTRY_KEY,
    value: REGISTRY_VAL,
  },
]
