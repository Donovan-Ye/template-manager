import path from 'node:path'
import process from 'node:process'

export const HOME = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'] || '~/'

/**
 * The path to the templates repository.
 */
export const TM_REPO_GIT = process.env.TM_REPO_GIT

/**
 * The name of the folder that contains the templates repository.
 */
export const TM_REPO_FOLDER = '.tm-repo'

/**
 * The name of the temporary repository that used to clone the templates repository.
 */
export const TEMP_REMO_LOCAL_PATH_PREFIX = path.join(HOME, TM_REPO_FOLDER)

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
 * The name of the README file.
 */
export const TM_README = 'README.md'

/**
 * The start of the README file that contains the templates information.
 */
export const TM_README_START = '<!-- tm-list-start -->'

/**
 * The end of the README file that contains the templates information.
 */
export const TM_README_END = '<!-- tm-list-end -->'

/**
 * The expiration time of the templates in milliseconds.
 * @default 1 hour
 */
export const EXPIRATION_TIME = 1000 * 60 * 60

/**
 * The initial content of the README file. Used in the `init` command.
 */
export const README_INIT_CONTENT = `# Templates Repository

This repository is used to store and manage templates for the [templates manager](https://github.com/Donovan-Ye/template-manager).

## My templates

${TM_README_START}

${TM_README_END}
`

/**
 * The initial content of the templates file. Used in the `init` command.
 */
export const TM_FILE_INIT_CONTENT = `[]`
