interface RemoteSourceData {
  url: string
  expirationTime: string
}

export type RemoteSource = Record<string, RemoteSourceData>

export interface Config {
  currentRemoteSource?: string
  templates?: TemplatesArray
  /**
   * Remote template sources, e.g. `ssh://git@github.com:user/repo.git`
   */
  remoteSources?: RemoteSource
}
