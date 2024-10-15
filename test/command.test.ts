import fs from 'node:fs'
import simpleGit from 'simple-git'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { TM_FILE_NAME } from '../src/constants'
import { getCurrentRemoteSource, updateConfig } from '../src/utils/config'
import { tm } from './utils/tm'

function expectSources(output: string, sources: string[]) {
  for (const source of sources) {
    expect(output).toContain(source)
  }
}

let currentRemoteSource: string | undefined
const testRemoteName = 'vitest_test_name'
const testRemoteUrl = './test/test_repo'
const testTemplateName = 'vitest_test_template_name'
const testTemplatePath = './test-template'

describe('commands flow test', () => {
  beforeAll(async () => {
    // create a local git bare repository
    fs.mkdirSync(testRemoteUrl)
    const git = simpleGit(testRemoteUrl)
    await git.init(['--bare'])

    // cache the current remote source
    const { currentRemoteSource: remoteSource } = await getCurrentRemoteSource({ warning: false })
    currentRemoteSource = remoteSource
  })

  afterAll(async () => {
    fs.rmdirSync(testRemoteUrl, { recursive: true })

    // restore the current remote source
    await updateConfig({ currentRemoteSource })
  })

  it('tm remote add <name> <source-url>', async () => {
    const add = tm(`remote add ${testRemoteName} ${testRemoteUrl}`)
    expect(add).toContain('added successfully')

    const ls = tm('remote ls')
    expectSources(ls, [testRemoteName])
  })

  it('tm remote add <name> <source-url> with existing name', async () => {
    const add = tm(`remote add ${testRemoteName} ${testRemoteUrl}`)
    expect(add).toContain('already exists')
  })

  it('tm remote use <name>', async () => {
    const use = tm(`remote use ${testRemoteName}`)
    expect(use).toContain('Switched to')

    const ls = tm('remote ls')
    expect(ls).toContain(`* ${testRemoteName}`)
  })

  it('tm list|ls with no templates config file', async () => {
    const ls = tm('list')

    expect(ls).toContain(`Getting templates from ${testRemoteUrl}`)
    expect(ls).toContain(`${TM_FILE_NAME} not found`)
  })

  it('tm init', async () => {
    const init = tm('init -f')

    expect(init).toContain('initialized successfully')
  })

  it('tm list|ls with templates config file and no templates', async () => {
    const ls = tm('list')

    expect(ls).toContain(`Getting templates from ${testRemoteUrl}`)
    expect(ls).toContain('No templates found')
  })

  it('tm add <template> <path>', async () => {
    const add = tm(`add ${testTemplateName} ${testTemplatePath}`)

    expect(add).toContain('Template added successfully')

    const ls = tm('list')
    expect(ls).toContain(testTemplateName)
  })

  it('tm set <template> <name>', async () => {
    const newTemplateName = 'vitest_test_template_name_new'
    const set = tm(`set ${testTemplateName} ${newTemplateName}`)

    expect(set).toContain('Template updated successfully')

    const ls = tm('list')
    expect(ls).toContain(newTemplateName)
  })

  it('tm remove|rm [template]', async () => {
    const remove = tm(`remove ${testTemplateName}`)

    expect(remove).toContain('Template removed successfully')

    const ls = tm('list')
    expect(ls).not.toContain(testTemplateName)
  })

  // ----clean remote----
  it('tm remote remove|rm <name>', async () => {
    const rm = tm(`remote rm ${testRemoteName}`)

    expect(rm).toContain('removed successfully')
    expect(rm).toContain('Switching to the first remote template source...')
  })

  it('tm remote remove|rm <name> with non-existing name', async () => {
    const rm = tm(`remote rm ${testRemoteName}`)

    expect(rm).toContain('not found')
  })
})
