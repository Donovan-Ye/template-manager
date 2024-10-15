import process from 'node:process'
import chalk from 'chalk'
import { logger } from './logger'

function padding(message = '', before = 1, after = 1): string {
  return Array.from({ length: before }).fill(' ').join('') + message + Array.from({ length: after }).fill(' ').join('')
}

export function geneDashLine(message: string, length: number): string {
  const finalMessage = Array.from({ length: Math.max(2, length - message.length + 2) }).join('-')
  return padding(chalk.dim(finalMessage))
}

interface ListFormattedContentsOptions {
  hintMessage?: string
  selectedName?: string
}
interface Content {
  label: string
  value: string
}

/**
 * List formatted contents
 */
export function listFormattedContents(contents: Content[], { hintMessage, selectedName }: ListFormattedContentsOptions = {}): void {
  if (contents.length === 0) {
    logger.warn(hintMessage || 'No contents found')
    process.exit(0)
  }

  const length = Math.max(...contents.map(content => content.label.length)) + 3

  const messages = contents.map((content) => {
    const isSelected = selectedName === content.label
    return `${isSelected ? chalk.green('* ') : '○ '}${content.label}${geneDashLine(content.label, length)}${content.value}`
  })

  logger.log(`${messages.join('\n')}`)
}
