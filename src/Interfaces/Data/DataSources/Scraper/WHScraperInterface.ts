export interface WHScraperI {
  startAuthSesion(userBrowserConfPath: string, tries: number): AsyncGenerator
  writeTaskOnQueue(
    userBrowserConfPath: string,
    action: string,
    target: string,
    onErrorHandler: (error: any) => void,
    onSuccessHandler: (arg: any) => void
  ): () => void
}
