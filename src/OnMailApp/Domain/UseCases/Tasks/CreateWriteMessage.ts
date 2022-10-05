import path from "path"
import { Task } from "../../Entities/Task"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"

export interface WriteMessageUseCaseI {
  invoke: (task: Task, token: string) => Promise<Task>
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

  public async invoke(task: Task, token: string) {
    const tokenDecoded: any =
      this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, task.user)

    const newTaskStored = await this.taskRepository.createTask(task, task.user)
    this.taskRepository.executeTask(
      newTaskStored,
      path.join(process.cwd(), "src", "assets", task.user, "WH")
    )
    return newTaskStored
  }
}
