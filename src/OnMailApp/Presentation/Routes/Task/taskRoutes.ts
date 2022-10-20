import { Request, Response, Router, NextFunction } from "express"
import { TaskRoutesI } from "../../../../Interfaces/Presentation/Routes/Task/taskRoutesInterface"
import { TaskControllerI } from "../../../../Interfaces/Presentation/Controllers/taskControllerInterface"
import { createWriteTaskValidator } from "../../Validators/taskValidator"

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

    const installEditTaskRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.editTask(req, res, next)
    router.patch("/:id", installEditTaskRoute)

    const installDeleteTaskRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.deleteTask(req, res, next)
    router.delete("/:id", installDeleteTaskRoute)

    const installWriteMessageRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.writeMessage(req, res, next)
    router.post(
      "/WH/writeMessage",
      createWriteTaskValidator,
      installWriteMessageRoute
    )

    const installGetContactsRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.getContacts(req, res, next)
    router.get("/WH/getContacts/:id", installGetContactsRoute)

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

  async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const contacts = await this.taskController.getContacts(req, res)
      return res.json({ result: contacts })
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
      res.write(`event:success\n`)
      res.write(`data:{result: successfully registered}\n\n`)
      res.end()
    } catch (error: any) {
      console.log(error)
      res.write(`event:error\n`)
      res.write(`data:{result: ${error.message}}\n\n`)
      res.end()
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

  async editTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const task = await this.taskController.editTask(req, res)
      return res.json({ result: task })
    } catch (error) {
      return next(error)
    }
  }

  async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.taskController.deleteTask(req, res)
      return res.json({})
    } catch (error) {
      return next(error)
    }
  }
}
