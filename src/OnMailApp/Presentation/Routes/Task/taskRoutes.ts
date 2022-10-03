import { Request, Response, Router, NextFunction } from "express"
import { loginValidator, refreshTokenValidator } from "../../Validators/authValidators"
import { TaskRoutesI } from "../../Interfaces/Routes/Task/taskRoutesInterface"
import { TaskControllerI } from "../../Interfaces/Controllers/taskControllerInterface"

export class TaskRoutes implements TaskRoutesI {
  private taskController: TaskControllerI<Request, Response>

  constructor(_taskController: TaskControllerI<Request, Response>) {
    this.taskController = _taskController
  }

  public registerRoutes(): Router {
    const router = Router()
    const installwriteMessageRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.writeMessage(req, res, next)

    router.post("/writeMessage", installwriteMessageRoute)

    return router
  }

  async writeMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const task = await this.taskController.writeMessage(req, res)
      return res.json({ result: task })
    } catch (error) {
      return next(error)
    }
  }
}
