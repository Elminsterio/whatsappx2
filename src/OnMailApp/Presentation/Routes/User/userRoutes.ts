import { Request, Response, Router, NextFunction } from "express"
import { UserControllerI } from "../../../../Interfaces/Presentation/Controllers/userControllerInterface"
import { UserRoutesI } from "../../../../Interfaces/Presentation/Routes/User/userRoutesInterface"
import {
  createUserValidator,
  updateUserValidator,
} from "../../Validators/userValidators"

export class UserRoutes implements UserRoutesI {
  private userController: UserControllerI<Request, Response>

  constructor(_userController: UserControllerI<Request, Response>) {
    this.userController = _userController
  }

  public registerRoutes(): Router {
    const router = Router()
    const installGetUsersRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.getUsers(req, res, next)
    router.get("/", installGetUsersRoute)
    
    const installCreateUsersRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.createUser(req, res, next)
    router.post("/", createUserValidator, installCreateUsersRoute)

    const installUpdateUsersRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.updateUser(req, res, next)
    router.patch("/:id", updateUserValidator, installUpdateUsersRoute)

    const installDeleteUsersRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.deleteUser(req, res, next)
    router.delete("/:id", installDeleteUsersRoute)

    const installGetUsersByIdRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.getUserById(req, res, next)
    router.get("/:id", installGetUsersByIdRoute)

    return router
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const users = await this.userController.getUsers(req, res)
      return res.json({ results: users })
    } catch (error) {
      return next(error)
    }
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = await this.userController.createUser(req, res)
      return res.json({ result: user })
    } catch (error) {
      return next(error)
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = await this.userController.getUserById(req, res)
      return res.json({ result: user })
    } catch (error) {
      return next(error)
    }
  }
  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = await this.userController.updateUser(req, res)
      return res.json({ result: user })
    } catch (error) {
      return next(error)
    }
  }
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.userController.deleteUser(req, res)
      return res.json({})
    } catch (error) {
      return next(error)
    }
  }
}
