import path from "path"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface GetContactsUseCaseI {
  invoke: (userId: string, token: string) => Promise<any>
}

export class GetContactsUseCase implements GetContactsUseCaseI {
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
    this.authRoleRepository.checkIsWHAuthenticated(user)
    const contacts = await this.taskRepository.WHGetContacts(
      path.join(process.cwd(), "src", "assets", userId, "WH"),
      userId
    )
    return contacts
  }
}
