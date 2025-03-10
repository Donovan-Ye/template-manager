import fs from 'node:fs'
import ini from 'ini'
import { NPMRC_PROJECT, PACKAGE_JSON_PROJECT, PUBLISH_CONFIG_KEY } from '../constants'
import { readLocalFile } from './reader'

export function updateNpmrc(key: string, value: string): void {
  // 这里需要每次读取文件，不能直接传入，因为可能会更新多次，如果直接传入，会导致部分更新丢失
  const npmrcConfig = ini.parse(readLocalFile(NPMRC_PROJECT)) || {}
  // 将新的键值对放在配置对象的最前面
  const newConfig = { [key]: value }
  for (const k in npmrcConfig) {
    if (k !== key)
      newConfig[k] = npmrcConfig[k]
  }
  fs.writeFileSync(NPMRC_PROJECT, ini.stringify(newConfig))
}

export function updatePackageJson(packageJsonObj: Record<string, any>, key: string, value: string): void {
  const publishConfig = packageJsonObj[PUBLISH_CONFIG_KEY] || {}

  if (!packageJsonObj[PUBLISH_CONFIG_KEY]) {
    // Create new object with name and publishConfig
    const newPackageJson = {
      name: packageJsonObj.name,
      [PUBLISH_CONFIG_KEY]: {
        ...publishConfig,
        [key]: value,
      },
      ...Object.fromEntries(
        Object.entries(packageJsonObj)
          .filter(([k]) => k !== 'name' && k !== PUBLISH_CONFIG_KEY),
      ),
    }
    fs.writeFileSync(PACKAGE_JSON_PROJECT, JSON.stringify(newPackageJson, null, 2))
  }
  else {
    packageJsonObj[PUBLISH_CONFIG_KEY] = {
      ...publishConfig,
      [key]: value,
    }
    fs.writeFileSync(PACKAGE_JSON_PROJECT, JSON.stringify(packageJsonObj, null, 2))
  }
}
