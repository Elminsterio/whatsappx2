const schedule = require("node-schedule")

module.exports = class TaskManager {
  constructor() {
    this.tasks = []
  }

  addTask(cb, time) {
    const taskObject = { executionTime: time, task: cb }
    this.tasks.unshift(taskObject)
  }

  async executeTasks() {
    for (let i = this.tasks.length - 1; 0 <= i; i--) {
      const { task, executionTime } = this.tasks[i]
      schedule.scheduleJob(executionTime, task)
      this.tasks.pop()
    }
  }
}
