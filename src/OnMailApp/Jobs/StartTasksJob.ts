import path from "path"
import { SchedulerI } from "../../Interfaces/Data/DataSources/Scheduler/SchedulerInterface"
import { WHScraperI } from "../../Interfaces/Data/DataSources/Scraper/WHScraperInterface"
import TaskDataSource from "../../Interfaces/Data/DataSources/TaskDataSource"
import UserDataSource from "../../Interfaces/Data/DataSources/UserDataSource"
import { Task } from "../Domain/Entities/Task"

export class StartTasksJob {
  public WHscraper: WHScraperI
  public scheduler: SchedulerI
  public taskDataSource: TaskDataSource
  public userDataSource: UserDataSource

  constructor(
    _taskDataSource: TaskDataSource,
    _userDataSource: UserDataSource,
    _WHscraper: WHScraperI,
    _scheduler: SchedulerI
  ) {
    this.taskDataSource = _taskDataSource
    this.userDataSource = _userDataSource
    this.WHscraper = _WHscraper
    this.scheduler = _scheduler
  }

  async addTasks() {
    try {
      const allTasks: Task[] = await this.taskDataSource.getAllTasks()

      for (let i = 0; i < allTasks.length; i++) {
        const {
          executionTime,
          taskType,
          userId,
          action,
          target,
          stopped,
          _id,
        } = allTasks[i]
        const actualUserTaskOwner: any = await this.userDataSource.getById(
          userId
        )

        if (!actualUserTaskOwner.isAuth || !actualUserTaskOwner || stopped)
          continue
        if (
          executionTime instanceof Date &&
          executionTime.getMilliseconds() > this.scheduler.millisecondsNextDay
        )
          continue

        const onErrorHandler = async (error: any) => {
          if (error.message === "Not authenticated") {
            this.userDataSource.edit(userId, { isAuth: false })
          }
          this.taskDataSource.editTask(_id, { stopped: true })
        }
        const onSuccessHandler = async () => {
          if (executionTime instanceof Date) {
            this.taskDataSource.editTask(_id, { historic: true })
          }
        }

        let cb: () => void
        const userPath = path.join(process.cwd(), "src", "assets", userId, "WH")
        switch (taskType) {
          case "WriteMessage":
            cb = this.WHscraper.writeTaskOnQueue(
              userPath,
              action,
              target,
              onErrorHandler,
              onSuccessHandler
            )
            break
          default:
            cb = this.WHscraper.writeTaskOnQueue(
              userPath,
              action,
              target,
              onErrorHandler,
              onSuccessHandler
            )
            break
        }

        const idString = _id.toString()
        this.scheduler.addScheduledJob(idString, executionTime, cb)
      }
      console.log(this.scheduler.getScheduledJobs())
    } catch (error) {
      throw error
    }
  }
}
