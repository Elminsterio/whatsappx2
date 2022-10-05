import schedule from "node-schedule"
import { URLS } from "./constants"
import { WhatsAppClient } from "./WhatsappClient"

export type TaskSchedule = {
  executionTime: string | Date
  task: Function
}

export interface TaskManagerI {
  tasks: TaskSchedule[]
  addTask(cb: () => Promise<void>, time: string | Date): void
  executeTasks(): void
  keepInitSesionTask(userBrowserConfPath: string): Promise<void>
  writeTask(
    userBrowserConfPath: string,
    message: string,
    contact: string
  ): () => Promise<void>
}

export class TaskManager implements TaskManagerI {
  tasks: TaskSchedule[]
  constructor() {
    this.tasks = []
  }

  async keepInitSesionTask(userBrowserConfPath: string) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })
    await whatsapp.initSesion()
    const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
    if (!isAuth) await whatsapp.authenticateSession('[data-testid="qrcode"]')
    await whatsapp.closeSesion()
  }

  writeTask(userBrowserConfPath: string, message: string, contact: string) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })

    return async () => {
      await whatsapp.initSesion()
      const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
      if (!isAuth) await whatsapp.authenticateSession('[data-testid="qrcode"]')
      else await whatsapp.awakeSession()
      await whatsapp.writeMsg(contact, message)
      await whatsapp.closeSesion()
    }
  }

  addTask(cb: () => Promise<void>, time: string | Date) {
    const taskObject: TaskSchedule = { executionTime: time, task: cb }
    this.tasks.unshift(taskObject)
  }

  async executeTasks() {
    for (let i = this.tasks.length - 1; 0 <= i; i--) {
      const { task, executionTime } = this.tasks[i]
      schedule.scheduleJob(executionTime, task as any)
      this.tasks.pop()
    }
  }
}
