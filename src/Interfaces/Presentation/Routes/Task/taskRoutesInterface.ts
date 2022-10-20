import { BaseRouteI } from "../baseRouteInterface"
import { Request, Response, NextFunction } from "express"

export interface TaskRoutesI extends BaseRouteI {
  writeMessage: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
  getContacts: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
  registerSesion: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
  getUserTasks: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
  editTask: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
  deleteTask: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
}
