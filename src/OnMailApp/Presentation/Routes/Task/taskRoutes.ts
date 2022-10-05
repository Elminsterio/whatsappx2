import { Request, Response, Router, NextFunction } from "express"
import { TaskRoutesI } from "../../Interfaces/Routes/Task/taskRoutesInterface"
import { TaskControllerI } from "../../Interfaces/Controllers/taskControllerInterface"

export class TaskRoutes implements TaskRoutesI {
  private taskController: TaskControllerI<Request, Response>

  constructor(_taskController: TaskControllerI<Request, Response>) {
    this.taskController = _taskController
  }

  public registerRoutes(): Router {
    const router = Router()
    const installWriteMessageRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.writeMessage(req, res, next)
    router.post("/writeMessage", installWriteMessageRoute)

    const installRegisterSesionRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.registerSesion(req, res, next)
    router.post("/registerSesion", installRegisterSesionRoute)

    const installGetTasksRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.getUserTasks(req, res, next)
    router.get("/:id", installGetTasksRoute)

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

  async registerSesion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.taskController.registerSesion(req, res)
      return res.json({ result: "Sesion has been registered" })
    } catch (error) {
      return next(error)
    }
  }

  async getUserTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const tasks = await this.taskController.getUserTasks(req, res)
      return res.json({ result: tasks })
    } catch (error) {
      return next(error)
    }
  }
}
