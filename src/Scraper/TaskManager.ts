import schedule, { JobCallback } from "node-schedule"

export type TaskSchedule = {
  executionTime: string | Date
  task: JobCallback
  id: string
}

export interface TaskManagerI {
  tasks: TaskSchedule[]
  addTask(cb: () => Promise<void>, time: string | Date, id: string): void
  executeTasks(): void
}

export class TaskManager implements TaskManagerI {
  tasks: TaskSchedule[]
  constructor() {
    this.tasks = []
  }

  getLoadedTasks() {
    return schedule.scheduledJobs
  }

  addTask(cb: JobCallback, time: string | Date, id: string) {
    const taskObject: TaskSchedule = { executionTime: time, task: cb, id }
    this.tasks.unshift(taskObject)
  }

  async executeTasks() {
    for (let i = this.tasks.length - 1; 0 <= i; i--) {
      const { task, executionTime, id } = this.tasks[i]
      schedule.scheduleJob(id, executionTime, task)
      this.tasks.pop()
    }
  }
}

