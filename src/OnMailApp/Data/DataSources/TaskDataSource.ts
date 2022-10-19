import { User } from "../../Domain/Entities/User"
import TaskDataSource from "../../../Interfaces/Data/DataSources/TaskDataSource"
import { DynamicTask, Task } from "../../Domain/Entities/Task"
import { ErrorBDEntityNotFound } from "../../Domain/Entities/Errors"
import { UserModelI } from "../../../Interfaces/Data/DataSources/Mongodb/UserModelInterface"
import { TaskModelI } from "../../../Interfaces/Data/DataSources/Mongodb/TaskModelInterface"
import { WHScraperI } from "../../../Interfaces/Data/DataSources/Scraper/WHScraperInterface"
import { SchedulerI } from "../../../Interfaces/Data/DataSources/Scheduler/SchedulerInterface"

export default class TaskDataSourceImpl implements TaskDataSource {
  public taskModel: any
  public userModel: any
  public WHScraper: WHScraperI
  public scheduler: SchedulerI

  constructor(
    _taskModel: TaskModelI,
    _userModel: UserModelI,
    _WHScraper: WHScraperI,
    _scheduler: SchedulerI
  ) {
    this.taskModel = _taskModel.model
    this.userModel = _userModel.model
    this.WHScraper = _WHScraper
    this.scheduler = _scheduler
  }

  async *WHInitSesion(userBrowserConfPath: string, tries: number) {
    yield* this.WHScraper.startAuthSesion(userBrowserConfPath, tries)
  }

  isWHSesionInitiated(userBrowserConfPath: string) {
    return this.WHScraper.isSesionInitiated(userBrowserConfPath)
  }

  async getTasksOfUser(userId: User["_id"]): Promise<Task[]> {
    return await this.taskModel.find({ user: userId })
  }

  async getTaskById(id: string): Promise<Task> {
    const tasksOnDB = await this.taskModel.findById({ _id: id })
    if (!tasksOnDB) throw new ErrorBDEntityNotFound("This task doesn't exist")
    return tasksOnDB
  }

  async getAllTasks(): Promise<Task[]> {
    const tasksOnDB = await this.taskModel.find()
    return tasksOnDB
  }

  async createTask(
    task: DynamicTask,
    userId: string,
    userBrowserConfPath: string
  ): Promise<Task> {
    const userOnDB: any = await this.userModel.findById({ _id: userId })
    if (!userOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any user"
      )
    const newTask = new this.taskModel(task)
    const { action, target, executionTime, _id } = newTask

    userOnDB.tasks.push(_id)
    const [, taskSaved] = await Promise.all([userOnDB.save(), newTask.save()])

    const ISOdateRegexp = new RegExp(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      "gi"
    )

    const executionTimeParsed = ISOdateRegexp.test(executionTime)
      ? new Date(executionTime)
      : executionTime

    const onErrorHandler = async (error: any) => {
      if (error.message === "Not authenticated") {
        userOnDB.isAuth = false
        await userOnDB.save()
      }
      newTask.stopped = true
      await newTask.save()
    }
    const onSuccessHandler = async () => {
      if (executionTimeParsed instanceof Date) {
        newTask.historic = true
        await newTask.save()
      }
    }
    const writeFunctionOnQueue = this.WHScraper.writeTaskOnQueue(
      userBrowserConfPath,
      action,
      target,
      onErrorHandler,
      onSuccessHandler
    )
    const stringId = _id.toString()
    this.scheduler.addScheduledJob(
      stringId,
      executionTimeParsed,
      writeFunctionOnQueue
    )

    return await taskSaved
  }
  
  //TODO: separate of concerns, create one different data source for Scheduler or Scraper  
  //TODO: modify editTask
  async editTask(taskId: string, task: DynamicTask): Promise<Task> {
    const isTaskOnDB = await this.taskModel.findByIdAndUpdate(taskId, task, {
      new: true,
      runValidators: true,
    })
    if (!isTaskOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any task"
      )

    if (task.executionTime) {
      this.scheduler.deleteScheduledJobs(taskId)
      this.scheduler.addScheduledJob(taskId, task.executionTime, isTaskOnDB)
    }
    return isTaskOnDB
  }

  async deleteTask(taskId: string, userId: string): Promise<Task> {
    const userOnDB = await this.userModel.findById(userId)
    if (!userOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any user"
      )

    const indexOfTask = userOnDB.tasks.indexOf(taskId)
    if (indexOfTask > -1) userOnDB.tasks.splice(indexOfTask, 1)
    else
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any task or it isn't assigned to this user"
      )

    const taskOnDB = await this.taskModel.findById(taskId)
    if (!taskOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any task"
      )
    this.scheduler.deleteScheduledJobs(taskOnDB._id)
    await Promise.all([userOnDB.save(), taskOnDB.remove()])
    return await taskOnDB
  }

  async deleteAllTasks(userId: string) {
    const userOnDB = await this.userModel.findById(userId)
    if (!userOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any user"
      )

    if (userOnDB.tasks?.length) {
      for (let i = 0; i < userOnDB.tasks.length; i++) {
        const taskId = userOnDB.tasks[i].toString()
        const task = await this.taskModel.findById(taskId)
        this.scheduler.deleteScheduledJobs(taskId)
        task.remove()
      }
    }
    return
  }
}
