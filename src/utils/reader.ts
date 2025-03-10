import fs from 'node:fs'

interface ReadFileOptions {
  silent?: boolean
}

export function readLocalFile(filePath: string, options: ReadFileOptions = {}): string {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  }
  catch (error) {
    if (!options.silent)
      throw error
  }

  return ''
}
