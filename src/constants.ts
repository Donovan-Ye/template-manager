import path from 'node:path'
import process from 'node:process'

export const HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] || '~/'

/**
 * The path to the templates repository.
 */
export const TM_REPO_GIT = process.env.TM_REPO_GIT

/**
 * The name of the temporary repository that used to clone the templates repository.
 */
export const TEMP_REMO_LOCAL_PATH = path.join(HOME, '.template-repository')

/**
 * The path to the .tmrc file.
 * @description settings file for the templates manager.
 */
export const TMRC = path.join(HOME, '.tmrc')

/**
 * The name of the file that contains the templates information.
 */
export const TM_FILE_NAME = 'templates.json'

/**
 * The expiration time of the templates in milliseconds.
 * @default 1 hour
 */
export const EXPIRATION_TIME = 1000 * 60 * 60
