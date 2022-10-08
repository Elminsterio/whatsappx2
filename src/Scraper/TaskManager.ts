import schedule from "node-schedule"

export type TaskSchedule = {
  executionTime: string | Date
  task: Function
}

export interface TaskManagerI {
  tasks: TaskSchedule[]
  addTask(cb: () => Promise<void>, time: string | Date): void
  executeTasks(): void
}

export class TaskManager implements TaskManagerI {
  tasks: TaskSchedule[]
  constructor() {
    this.tasks = []
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

/*
async function init() {
  const tasker = new TaskManager()
  const initSesion = tasker.keepInitSesionTask('./hola')
  for await(let qr of initSesion) {
    console.log(qr)
  }
}

init()

*/
