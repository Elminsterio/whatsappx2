import path from "path"
import { DynamicTask, Task } from "../../Entities/Task"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"

export interface WriteMessageUseCaseI {
  invoke: (task: DynamicTask, token: string) => Promise<Task>
}

export class WriteMessageUseCase implements WriteMessageUseCaseI {
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

  public async invoke(task: DynamicTask, token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, task.userId)
    this.authRoleRepository.checkIsWHAuthenticated(tokenDecoded)
    const newTaskStored = await this.taskRepository.createTask(
      task,
      path.join(process.cwd(), "src", "assets", task.userId, "WH"),
      task.userId
    )

    return newTaskStored
  }
}
