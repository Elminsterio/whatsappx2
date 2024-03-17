import { WhatsAppClient } from "../../../../Scraper/WhatsappClient"

export interface WHScraperI {
  sesions: { [userBrowserConfPath: string]: WhatsAppClient }
  isSessionInitiated(userBrowserConfPath: string): boolean
  startAuthSesion(userBrowserConfPath: string, tries: number): AsyncGenerator
  getAllContacts(userBrowserConfPath: string): Promise<any>
  writeTaskOnQueue(
    userBrowserConfPath: string,
    sendObj: any,
    onErrorHandler: (error: any) => void,
    onSuccessHandler: (arg: any) => void
  ): () => void
  executeAllTasks(): void | Error 
}
