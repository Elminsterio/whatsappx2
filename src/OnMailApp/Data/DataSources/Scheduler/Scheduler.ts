import schedule, { Job } from "node-schedule"
import { SchedulerI } from "../../../../Interfaces/Data/DataSources/Scheduler/SchedulerInterface"

export class Scheduler implements SchedulerI {
  public actualDate: Date
  public nextDay: Date

  constructor() {
    const actualDate: Date = new Date()
    const actualYear: number = actualDate.getFullYear()
    const actualMonth: number = actualDate.getMonth()
    const actualDay: number = actualDate.getDate()
    const nextDay: Date = new Date(actualYear, actualMonth, actualDay + 1, 0, 0, 0)
    this.actualDate = new Date()
    this.nextDay = nextDay
  }

  getScheduledJobs(): { [jobName: string]: Job } {
    return schedule.scheduledJobs
  }

  addScheduledJob(
    taskId: string,
    executionTime: string | Date,
    task: Function
  ): boolean | void {
    if (
        executionTime instanceof Date &&
        executionTime < this.nextDay &&
        executionTime > this.actualDate
    ) {
      schedule.scheduleJob(taskId, executionTime, task as schedule.JobCallback)
    }
  }

  deleteScheduledJobs(taskId: string): boolean | void {
    const jobNames = schedule.scheduledJobs
    if (jobNames[taskId]) jobNames[taskId].cancel()
  }

  deleteAllUserScheduledJobs(userTasksArray: string[]): boolean | void {
    const jobNames = schedule.scheduledJobs
    if (userTasksArray.length) {
      for (let i = 0; i < userTasksArray.length; i++) {
        const taskId = userTasksArray[i]
        if (jobNames[taskId]) jobNames[taskId].cancel()
      }
    }
  }
}
