import { WhatsAppClient } from "../../../../Scraper/WhatsappClient"

export interface WHScraperI {
  sesions: { [userBrowserConfPath: string]: WhatsAppClient }
  isSesionInitiated(userBrowserConfPath: string): boolean
  startAuthSesion(userBrowserConfPath: string, tries: number): AsyncGenerator
  writeTaskOnQueue(
    userBrowserConfPath: string,
    action: string,
    target: string,
    onErrorHandler: (error: any) => void,
    onSuccessHandler: (arg: any) => void
  ): () => void
  executeAllTasks(): void | Error 
}
