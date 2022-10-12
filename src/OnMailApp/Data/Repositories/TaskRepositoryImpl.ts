import { TasksI } from "../../../Scraper/Tasks"
import { TaskManagerI } from "../../../Scraper/TaskManager"
import { Task } from "../../Domain/Entities/Task"
import { User } from "../../Domain/Entities/User"
import TaskRepository from "../../Domain/Repositories/TaskRepository"
import TaskDataSource from "../../../Interfaces/Data/DataSources/TaskDataSource"
import UserDataSource from "../../../Interfaces/Data/DataSources/UserDataSource"

export class TaskRepositoryImpl implements TaskRepository {
  public userDataSource: UserDataSource
  public taskDataSource: TaskDataSource
  public tasksManager: TaskManagerI
  public tasks: TasksI

  constructor(
    _userDatasource: UserDataSource,
    _taskDataSource: TaskDataSource,
    _tasks: TasksI,
    _tasksManager: TaskManagerI
  ) {
    this.userDataSource = _userDatasource
    this.taskDataSource = _taskDataSource
    this.tasks = _tasks
    this.tasksManager = _tasksManager
  }

  addTaskToManager(task: Task, userDBrowserConfPath: string) {
    const { executionTime, taskType, action, target, userId } = task
    let cb: () => Promise<void>
    switch (taskType) {
      case "WriteMessage":
        cb = this.tasks.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
      default:
        cb = this.tasks.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
    }
    // TODO: añadir filtro para cargar sólo las del día
    this.tasksManager.addTask(cb, executionTime, userId)
  }

  async createTask(
    task: Task,
    userDBrowserConfPath: string,
    userId: User["_id"]
  ) {
    const { executionTime, taskType, action, target } = task
    let cb: () => Promise<void>
    switch (taskType) {
      case "WriteMessage":
        cb = this.tasks.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
      default:
        cb = this.tasks.writeTask(
          userDBrowserConfPath,
          action as string,
          target as string
        )
        break
    }
    return await this.taskDataSource.createTask(task, userId, cb)
  }

  keepSesionTask(userBrowserConfPath: string, tries: number) {
    return this.tasks.keepInitSesionTask(userBrowserConfPath, tries)
  }

  async getTasksOfUser(userId: User["_id"]): Promise<Task[]> {
    return await this.taskDataSource.getTasksOfUser(userId)
  }

  async getTaskById(id: Task["userId"]): Promise<Task> {
    return await this.taskDataSource.getTaskById(id)
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskDataSource.getAllTasks()
  }

  async editTask(id: string, task: Task): Promise<Task> {
    return await this.taskDataSource.editTask(id, task)
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    return await this.taskDataSource.deleteTask(taskId, userId)
  }

  async deleteAllTasks(userId: string): Promise<void> {
    return await this.taskDataSource.deleteAllTasks(userId)
  }
}
