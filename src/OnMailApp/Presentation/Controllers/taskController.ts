import { Request, Response } from "express"
import { UnathorizedError } from "../../Domain/Entities/Errors"
import { DynamicTask } from "../../Domain/Entities/Task"
import { WriteMessageUseCaseI } from "../../Domain/UseCases/Tasks/CreateWriteMessage"
import { GetUserTasksUseCaseI } from "../../Domain/UseCases/Tasks/GetUserTasks"
import { RegisterSesionUseCaseI } from "../../Domain/UseCases/Tasks/RegisterSesion"
import { TaskControllerI } from "../../../Interfaces/Presentation/Controllers/taskControllerInterface"
import { DeleteTaskUseCaseI } from "../../Domain/UseCases/Tasks/DeleteTask"
import { EditTaskUseCaseI } from "../../Domain/UseCases/Tasks/EditTask"

export class TaskController implements TaskControllerI<Request, Response> {
  writeMessageUseCase: WriteMessageUseCaseI
  registerSesionUseCase: RegisterSesionUseCaseI
  getUserTasksUseCase: GetUserTasksUseCaseI
  deleteMessageUseCase: DeleteTaskUseCaseI
  editTaskUseCase: EditTaskUseCaseI

  constructor(
    _writeMessageUseCase: WriteMessageUseCaseI,
    _registerSesionUseCase: RegisterSesionUseCaseI,
    _getUserTasksUseCase: GetUserTasksUseCaseI,
    _deleteMessageUseCase: DeleteTaskUseCaseI,
    _editTaskUseCase: EditTaskUseCaseI
  ) {
    this.writeMessageUseCase = _writeMessageUseCase
    this.registerSesionUseCase = _registerSesionUseCase
    this.getUserTasksUseCase = _getUserTasksUseCase
    this.deleteMessageUseCase = _deleteMessageUseCase
    this.editTaskUseCase = _editTaskUseCase
  }

  registerSesion(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")

    return this.registerSesionUseCase.invoke(id, token)
  }

  async writeMessage(req: Request, res: Response) {
    const { id, message, time, target } = req.body
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")

    const task: DynamicTask = {
      executionTime: time,
      userId: id,
      action: message,
      taskType: "WriteMessage",
      target,
    }

    return await this.writeMessageUseCase.invoke(task, token)
  }

  async editTask(req: Request, res: Response) {
    const { executionTime, action, target, stopped } = req.body
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")
    const task: DynamicTask = {
      executionTime,
      action,
      target,
      stopped,
    }
    return await this.editTaskUseCase.invoke(task, id, token)
  }

  async getUserTasks(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")

    return await this.getUserTasksUseCase.invoke(id, token)
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")

    return await this.deleteMessageUseCase.invoke(id, token)
  }
}
