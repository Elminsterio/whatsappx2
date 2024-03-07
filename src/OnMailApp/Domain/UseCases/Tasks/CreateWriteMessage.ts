import path from "path"
import { DynamicTask, Task } from "../../Entities/Task"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface WriteMessageUseCaseI {
  invoke: (task: DynamicTask, token: string) => Promise<Task>
}

export class WriteMessageUseCase implements WriteMessageUseCaseI {
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

  public async invoke(task: DynamicTask, token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, task.userId as string)
    const user = await this.userRepository.getById(task.userId as string)
    this.authRoleRepository.checkIsWHAuthenticated(user)
    const newTaskStored = await this.taskRepository.createTask(
      task,
      path.join(process.cwd(), "src", "assets", task.userId as string, "WH"),
      task.userId as string
    )

    return newTaskStored
  }
}
