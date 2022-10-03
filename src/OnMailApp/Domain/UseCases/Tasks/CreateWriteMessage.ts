import { Task } from "../../Entities/Task"
import { User } from "../../Entities/User"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"

export interface WriteMessageUseCaseI {
  invoke: (
    message: string,
    time: Task["executionTime"],
    userId: string,
    token: string
  ) => Promise<Task>
}

export class WriteMessageUseCase implements WriteMessageUseCaseI {
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository
  public taskRepository: TaskRepository
  public writeTask: Function

  constructor(
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository,
    _taskRepository: TaskRepository,
    _writeTask: Function
  ) {
    this.authRepository = _authRepository
    this.authRoleRepository = _authRoleRepository
    this.taskRepository = _taskRepository
    this.writeTask = _writeTask
  }

  public async invoke(
    message: string,
    time: Task["executionTime"],
    userId: string,
    token: string
  ) {
    const tokenDecoded: object | undefined =
      this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, userId)
    const cb = this.writeTask(userId)
    
    const newtask: Task = {
      executionTime: time,
      user: userId,
      taskType: 'WriteMessage',
      taskFunction: cb
    }

    return await this.taskRepository.createTask(newtask, userId)
  }
}
