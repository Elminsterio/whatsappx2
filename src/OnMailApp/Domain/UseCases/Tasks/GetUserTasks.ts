import { Task } from "../../Entities/Task"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"

export interface GetUserTasksUseCaseI {
  invoke: (userId: string, token: string) => Promise<Task[]>
}

export class GetUserTasksUseCase implements GetUserTasksUseCaseI {
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository
  public taskRepository: TaskRepository

  constructor(
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository,
    _taskRepository: TaskRepository
  ) {
    ;(this.authRepository = _authRepository),
      (this.authRoleRepository = _authRoleRepository),
      (this.taskRepository = _taskRepository)
  }

  public async invoke(userId: string, token: string) {
    const tokenDecoded: any =
      this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, userId)
    return await this.taskRepository.getTasksOfUser(userId)
  }
}
