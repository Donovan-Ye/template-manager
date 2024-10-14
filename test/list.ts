// import { afterAll, beforeAll, describe, expect, it } from 'vitest'
// import { getConfig, getRemoteSources, updateConfig } from '../src/utils/config'
// import { getTemplateFile } from '../src/utils/git'
// import { tm } from './utils/tm'
// import type { TemplatesArray } from '../src/types/templates'

// let currentRemoteSource: string
// let currentTemplates: TemplatesArray = []

// describe('base commands, including list, add, remove, etc.', () => {
//   beforeAll(async () => {
//     const { currentRemoteSource: remoteSource, templates } = await getConfig()
//     currentRemoteSource = remoteSource ?? ''
//     currentTemplates = templates ?? []
//   })

//   afterAll(async () => {
//     await updateConfig({ currentRemoteSource, templates: currentTemplates })
//   })

//   it('tm list|ls without current remote template source', async () => {
//     const output = tm('list')
//     expect(output).toContain('No current remote template source found')
//   })

//   it('tm list|ls with current remote template source', async () => {
//     await updateConfig({ currentRemoteSource: 'test' })

//     const output = tm('list')
//     expect(output).toContain('test')
//   })
// })
