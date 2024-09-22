import chalk from 'chalk'

function padding(message = '', before = 1, after = 1): string {
  return Array.from({ length: before }).fill(' ').join('') + message + Array.from({ length: after }).fill(' ').join('')
}

export function geneDashLine(message: string, length: number): string {
  const finalMessage = Array.from({ length: Math.max(2, length - message.length + 2) }).join('-')
  return padding(chalk.dim(finalMessage))
}
