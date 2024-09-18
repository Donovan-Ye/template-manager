/* eslint-disable no-console */
import chalk from 'chalk'

export const logger = {
  success(...args: unknown[]) {
    console.log(chalk.green(...args))
  },
  error(...args: unknown[]) {
    console.log(chalk.red(...args))
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args))
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args))
  },
  log(...args: unknown[]) {
    console.log(chalk.white(...args))
  },
  break() {
    console.log('')
  },
}
