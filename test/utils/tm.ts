import { execSync } from 'node:child_process'

/**
 * Execute the tm command and return the stdout
 * @param command - The command to execute
 * @returns The stdout of the command
 */
export const tm = (command: string): string => execSync(`npx esno src/index.ts ${command}`).toString()
