import { TasksI } from "../../../Scraper/Tasks"
import { Task } from "../../Domain/Entities/Task"
import { User } from "../../Domain/Entities/User"
import TaskRepository from "../../Domain/Repositories/TaskRepository"
import TaskDataSource from "../../../Interfaces/Data/DataSources/TaskDataSource"
import UserDataSource from "../../../Interfaces/Data/DataSources/UserDataSource"

export class TaskRepositoryImpl implements TaskRepository {
  public userDataSource: UserDataSource
  public taskDataSource: TaskDataSource
  public tasks: TasksI

  constructor(
    _userDatasource: UserDataSource,
    _taskDataSource: TaskDataSource,
    _tasks: TasksI,
  ) {
    this.userDataSource = _userDatasource
    this.taskDataSource = _taskDataSource
    this.tasks = _tasks
  }

  async createTask(
    task: Task,
    userDBrowserConfPath: string,
    userId: User["_id"]
  ) {
    return await this.taskDataSource.createTask(task, userId, userDBrowserConfPath)
  }

  async *WHInitSesion(userBrowserConfPath: string, tries: number) {
    yield* this.taskDataSource.WHInitSesion(userBrowserConfPath, tries)
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
