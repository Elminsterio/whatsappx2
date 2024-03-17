import { WHScraperI } from "../../../../Interfaces/Data/DataSources/Scraper/WHScraperInterface"
import { TaskManagerI } from "../../../../Scraper/TaskManager"
import { TasksI } from "../../../../Scraper/Tasks"
import { WhatsAppClient } from "../../../../Scraper/WhatsappClient"

export class WHScraper implements WHScraperI {
  public taskManager: TaskManagerI
  public tasks: TasksI
  sesions: { [userBrowserConfPath: string]: WhatsAppClient }

  constructor(_taskManager: TaskManagerI, _tasks: TasksI) {
    this.taskManager = _taskManager
    this.tasks = _tasks
    this.sesions = _tasks.sesions
  }
  
  isSessionInitiated(userBrowserConfPath: string) {
    if(this.sesions[userBrowserConfPath]) {
      return true
    }
    return false
  }

  executeAllTasks(): void | Error {
    this.taskManager.executeTasks()
  }

  async *startAuthSesion(
    userBrowserConfPath: string,
    tries: number
  ): AsyncGenerator {
    yield* this.tasks.keepInitSesionTaskNoConcurrency(userBrowserConfPath, tries)
  }

  async getAllContacts(userBrowserConfPath: string): Promise<any> {
    return await this.tasks.getAllContactsTask(userBrowserConfPath)
  }


  writeTaskOnQueue(
    userBrowserConfPath: string,
    sendObj: any,
    onErrorHandler: (error: any) => void,
    onSuccessHandler: (arg: any) => void
  ) {
    return () => {
      this.taskManager.addTask(
        this.tasks.writeTask(
          userBrowserConfPath,
          sendObj,
          onErrorHandler,
          onSuccessHandler
        )
      )
      this.taskManager.executeTasks()
    }
  }
}
