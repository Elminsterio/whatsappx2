import { Request, Response } from "express"
import { WriteMessageUseCaseI } from "../../Domain/UseCases/Tasks/CreateWriteMessage"
import { TaskControllerI } from "../Interfaces/Controllers/taskControllerInterface"

export class TaskController implements TaskControllerI<Request, Response> {
  writeMessageUseCase: WriteMessageUseCaseI

  constructor(_writeMessageUseCase: WriteMessageUseCaseI) {
    this.writeMessageUseCase = _writeMessageUseCase
  }

  async writeMessage(req: Request, res: Response) {
    const { id, message, time } = req.body
    const token: any = req.get("Authorization")

    return await this.writeMessageUseCase.invoke(message, time, id, token)
  }
}
