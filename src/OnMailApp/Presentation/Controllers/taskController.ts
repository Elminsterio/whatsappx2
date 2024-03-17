import { Request, Response } from "express"
import {
  MultipleValidationDataError,
  UnathorizedError,
} from "../../Domain/Entities/Errors"
import { DynamicTask } from "../../Domain/Entities/Task"
import { WriteMessageUseCaseI } from "../../Domain/UseCases/Tasks/CreateWriteMessage"
import { GetUserTasksUseCaseI } from "../../Domain/UseCases/Tasks/GetUserTasks"
import { RegisterSesionUseCaseI } from "../../Domain/UseCases/Tasks/RegisterSesion"
import { TaskControllerI } from "../../../Interfaces/Presentation/Controllers/taskControllerInterface"
import { DeleteTaskUseCaseI } from "../../Domain/UseCases/Tasks/DeleteTask"
import { EditTaskUseCaseI } from "../../Domain/UseCases/Tasks/EditTask"
import { validationResult } from "express-validator"
import { GetContactsUseCaseI } from "../../Domain/UseCases/Tasks/GetContacts"

export class TaskController implements TaskControllerI<Request, Response> {
  writeMessageUseCase: WriteMessageUseCaseI
  getContactsUseCase: GetContactsUseCaseI
  registerSesionUseCase: RegisterSesionUseCaseI
  getUserTasksUseCase: GetUserTasksUseCaseI
  deleteMessageUseCase: DeleteTaskUseCaseI
  editTaskUseCase: EditTaskUseCaseI

  constructor(
    _writeMessageUseCase: WriteMessageUseCaseI,
    _getContactsUseCase: GetContactsUseCaseI,
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
    this.getContactsUseCase = _getContactsUseCase
  }

  registerSesion(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")

    return this.registerSesionUseCase.invoke(id, token)
  }

  async getContacts(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")
    return await this.getContactsUseCase.invoke(id, token)
  }

  async writeMessage(req: Request, res: Response) {
    const errors = validationResult(req)
    const messageError = JSON.stringify(errors.array())

    if (!errors.isEmpty()) throw new MultipleValidationDataError(messageError)

    const { id, message, time, targetPhone, destinatary } = req.body
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")
    const task: DynamicTask = {
      executionTime: time,
      userId: id,
      action: message,
      taskType: "WriteMessage",
      targetPhone,
      destinatary
    }

    return await this.writeMessageUseCase.invoke(task, token)
  }

  async editTask(req: Request, res: Response) {
    const { executionTime, action, targetPhone, stopped, destinatary } = req.body
    const { id } = req.params
    const token = req.get("Authorization")
    if (!token)
      throw new UnathorizedError("Bearer token is not provided or is invalid")
    const task: DynamicTask = {
      executionTime,
      action,
      targetPhone,
      destinatary,
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
