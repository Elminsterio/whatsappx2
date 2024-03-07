import { User } from "../../Entities/User"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface DeleteTaskUseCaseI {
  invoke: (task: string, token: string) => void
}

export class DeleteTaskUseCase implements DeleteTaskUseCaseI {
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository
  public taskRepository: TaskRepository
  public userRepository: UsersRepository

  constructor(
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository,
    _taskRepository: TaskRepository,
    _userRepository: UsersRepository
  ) {
    ;(this.authRepository = _authRepository),
      (this.authRoleRepository = _authRoleRepository),
      (this.taskRepository = _taskRepository),
      this.userRepository = _userRepository
  }

  public async invoke(taskId: string, token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    const user: User = await this.userRepository.getById(tokenDecoded._id)
    this.authRoleRepository.checkIsOwnTask(user, taskId)
    return await this.taskRepository.deleteTask(taskId, tokenDecoded._id)
  }
}
