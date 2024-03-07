import { Job } from "node-schedule"

export interface SchedulerI {
  actualDate: Date
  nextDay: Date
  getScheduledJobs: () => { [jobName: string]: Job; }
  addScheduledJob(taskId: string, executionTime: string | Date, task: Function): boolean | void
  deleteScheduledJobs(taskId: string): boolean | void
  deleteAllUserScheduledJobs(userTasksArray: string[]): boolean | void
}