import schedule from "node-schedule"

type TaskSchedule = {
  executionTime: string | Date,
  task: Function
}

export class TaskManager {
  tasks: TaskSchedule[]
  constructor() {
    this.tasks = []
  }

  addTask(cb: Function, time: string | Date) {
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
