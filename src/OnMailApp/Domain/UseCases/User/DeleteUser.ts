import { User } from "../../Entities/User"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"
import fsPromise from "fs/promises"
import fs from "fs"
import path from "path"
import TaskRepository from "../../Repositories/TaskRepository"

export interface DeleteUserUseCaseI {
  invoke: (userId: string, token: string) => Promise<User>
}

export class DeleteUserUseCase implements DeleteUserUseCaseI {
  public usersRepository: UsersRepository
  public taskRepository: TaskRepository
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository

  constructor(
    _userRepository: UsersRepository,
    _taskRepository: TaskRepository,
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository
  ) {
    this.usersRepository = _userRepository
    this.taskRepository = _taskRepository
    this.authRepository = _authRepository
    this.authRoleRepository = _authRoleRepository
  }

  public async invoke(userId: string, token: string) {
    this.authRoleRepository.checkIsOwnId(
      this.authRepository.verifyToken(token),
      userId
    )
    await this.taskRepository.deleteAllTasks(userId)
    const user = await this.usersRepository.delete(userId)
    const userDir = path.join(process.cwd(), "src", "assets", userId)
    if (fs.existsSync(userDir)) {
      await fsPromise.rm(userDir, { recursive: true, force: true })
    }
    return user
  }
}
