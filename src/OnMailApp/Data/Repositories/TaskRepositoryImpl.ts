import { Task } from "../../Domain/Entities/Task"
import { User } from "../../Domain/Entities/User"
import TaskRepository from "../../Domain/Repositories/TaskRepository"
import TaskDataSource from "../Interfaces/DataSources/TaskDataSource"
import UserDataSource from "../Interfaces/DataSources/UserDataSource"

export class TaskRepositoryImpl implements TaskRepository {
  public userDataSource: UserDataSource
  public taskDataSource: TaskDataSource

  constructor(
    _userDatasource: UserDataSource,
    _taskDataSource: TaskDataSource
  ) {
    this.userDataSource = _userDatasource
    this.taskDataSource = _taskDataSource
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
    return await this.taskDataSource.deleteTask(taskId, userId)
  }
}
