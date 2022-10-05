import { Request, Response } from "express"
import { Task } from "../../Domain/Entities/Task"
import { WriteMessageUseCaseI } from "../../Domain/UseCases/Tasks/CreateWriteMessage"
import { GetUserTasksUseCaseI } from "../../Domain/UseCases/Tasks/GetUserTasks"
import { RegisterSesionUseCaseI } from "../../Domain/UseCases/Tasks/RegisterSesion"
import { TaskControllerI } from "../Interfaces/Controllers/taskControllerInterface"

export class TaskController implements TaskControllerI<Request, Response> {
  writeMessageUseCase: WriteMessageUseCaseI
  registerSesionUseCase: RegisterSesionUseCaseI
  getUserTasksUseCase: GetUserTasksUseCaseI

  constructor(
    _writeMessageUseCase: WriteMessageUseCaseI,
    _registerSesionUseCase: RegisterSesionUseCaseI,
    _getUserTasksUseCase: GetUserTasksUseCaseI
  ) {
    this.writeMessageUseCase = _writeMessageUseCase
    this.registerSesionUseCase = _registerSesionUseCase
    this.getUserTasksUseCase = _getUserTasksUseCase
  }

  async registerSesion(req: Request, res: Response) {
    const { id } = req.body
    const token: any = req.get("Authorization")

    return await this.registerSesionUseCase.invoke(id, token)
  }

  async writeMessage(req: Request, res: Response) {
    const { id, message, time, target } = req.body
    const token: any = req.get("Authorization")

    const task: Task = {
      executionTime: time,
      user: id,
      action: message,
      taskType: "WriteMessage",
      target,
    }

    return await this.writeMessageUseCase.invoke(task, token)
  }

  async getUserTasks(req: Request, res: Response) {
    const { id } = req.params
    const token: any = req.get("Authorization")

    return await this.getUserTasksUseCase.invoke(id, token)
  }
}
