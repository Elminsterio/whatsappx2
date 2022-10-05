import path from "path"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface RegisterSesionUseCaseI {
  invoke: (userId: string, token: string) => Promise<void>
}

export class RegisterSesionUseCase implements RegisterSesionUseCaseI {
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
      (this.userRepository = _userRepository)
  }

  public async invoke(userId: string, token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, userId)
    const user = await this.userRepository.getById(userId)
    if (user.isAuth === true) {
      return
    } else {
      // mejorar la lógica para permitir el update de un campo sólo
      await this.taskRepository.keepSesionTask(
        path.join(process.cwd(), "src", "assets", userId, "WH")
      )
      user.isAuth = true
      delete user._id
      this.userRepository.edit(userId, user)
      return
    }
  }
}
