import { Job } from "node-schedule"

export interface SchedulerI {
  millisecondsActualDate: number
  millisecondsNextDay: number
  getScheduledJobs: () => { [jobName: string]: Job; }
  addScheduledJob(taskId: string, executionTime: string | Date, task: Function): boolean | void
  deleteScheduledJobs(taskId: string): boolean | void
  deleteAllUserScheduledJobs(userTasksArray: string[]): boolean | void
}