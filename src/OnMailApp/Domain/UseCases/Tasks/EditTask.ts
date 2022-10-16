import { DynamicTask, Task } from "../../Entities/Task"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import TaskRepository from "../../Repositories/TaskRepository"

export interface EditTaskUseCaseI {
  invoke: (task: DynamicTask, taskId: string, token: string) => Promise<Task>
}

export class EditTaskUseCase implements EditTaskUseCaseI {
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

  public async invoke(task: DynamicTask, taskId: string, token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnTask(tokenDecoded, taskId)
    return await this.taskRepository.editTask(taskId, task)
  }
}
