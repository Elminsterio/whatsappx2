import { Request, Response, Router, NextFunction } from "express"
import { TaskRoutesI } from "../../../../Interfaces/Presentation/Routes/Task/taskRoutesInterface"
import { TaskControllerI } from "../../../../Interfaces/Presentation/Controllers/taskControllerInterface"

export class TaskRoutes implements TaskRoutesI {
  private taskController: TaskControllerI<Request, Response>

  constructor(_taskController: TaskControllerI<Request, Response>) {
    this.taskController = _taskController
  }

  public registerRoutes(): Router {
    const router = Router()
    const installGetTasksRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.getUserTasks(req, res, next)
    router.get("/:id", installGetTasksRoute)

    const installWriteMessageRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.writeMessage(req, res, next)
    router.post("/WH/writeMessage", installWriteMessageRoute)

    const installRegisterSesionRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.registerSesion(req, res, next)
    router.get("/WH/registerSesion/:id", installRegisterSesionRoute)

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
//TODO: Learn to close correctly connection
  async registerSesion(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const qrs = this.taskController.registerSesion(req, res)
      await qrs.next()

      res.setHeader("Content-Type", "text/event-stream")
      res.setHeader("Cache-Control", "no-store")
      res.flushHeaders()
      
      for await (let qr of qrs) {
        const qrString = JSON.stringify({ result: qr })
        res.write(`data:${qrString}\n\n`)
      }
      res.end()
    } catch (error) {
      next(error)
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
