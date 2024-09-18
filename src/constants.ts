import path from 'node:path'
import process from 'node:process'

/**
 * The path to the .tmrc file.
 * @description settings file for the templates manager.
 */
export const TMRC = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] || '~/', '.tmrc')

/**
 * The name of the file that contains the templates information.
 */
export const TEMPLATE_FILE_NAME = 'templates.json'

/**
 * The name of the temporary repository that used to clone the templates repository.
 */
export const TEMP_REPO_NAME = 'template-repository'

/**
 * The expiration time of the templates in milliseconds.
 * @default 1 hour
 */
export const EXPIRATION_TIME = 1000 * 60 * 60
