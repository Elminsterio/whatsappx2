import schedule from "node-schedule"
import { TaskManagerI } from "../../../Scraper/TaskManager"
import { Task } from "../../Domain/Entities/Task"
import { User } from "../../Domain/Entities/User"
import TaskRepository from "../../Domain/Repositories/TaskRepository"
import TaskDataSource from "../Interfaces/DataSources/TaskDataSource"
import UserDataSource from "../Interfaces/DataSources/UserDataSource"

export class TaskRepositoryImpl implements TaskRepository {
  public userDataSource: UserDataSource
  public taskDataSource: TaskDataSource
  public taskManager: TaskManagerI

  constructor(
    _userDatasource: UserDataSource,
    _taskDataSource: TaskDataSource,
    _taskManager: TaskManagerI
  ) {
    this.userDataSource = _userDatasource
    this.taskDataSource = _taskDataSource
    this.taskManager = _taskManager
  }

  addTaskToManager(task: Task, userDBrowserConfPath: string) {
    const { executionTime, taskType, action, target } = task
    let cb: () => Promise<void>
    switch (taskType) {
      case "WriteMessage":
        cb = this.taskManager.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
      default:
        cb = this.taskManager.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
    }
    // TODO: añadir filtro para cargar sólo las del día
    this.taskManager.addTask(cb, executionTime)
  }

  executeTask(task: Task, userDBrowserConfPath: string) {
    const { executionTime, taskType, action, target } = task
    let cb: () => Promise<void>
    switch (taskType) {
      case "WriteMessage":
        cb = this.taskManager.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
      default:
        cb = this.taskManager.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
    }
    schedule.scheduleJob(task._id as string, executionTime, cb)
  }

  async keepSesionTask(userBrowserConfPath: string) {
    // TODO: entregar el QR en una conexión keepalive
    return await this.taskManager.keepInitSesionTask(userBrowserConfPath)
  }

  async getTasksOfUser(userId: User["_id"]): Promise<Task[]> {
    return await this.taskDataSource.getTasksOfUser(userId)
  }

  async getTaskById(id: Task["user"]): Promise<Task> {
    return await this.taskDataSource.getTaskById(id)
  }

  async createTask(task: Task, userId: string): Promise<Task> {
    return await this.taskDataSource.createTask(task, userId)
  }

  async editTask(id: string, task: Task): Promise<Task> {
    return await this.taskDataSource.editTask(id, task)
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const jobNames = schedule.scheduledJobs
    console.log(jobNames)
    if (jobNames[taskId]) jobNames[taskId].cancel()
    return await this.taskDataSource.deleteTask(taskId, userId)
  }
}
