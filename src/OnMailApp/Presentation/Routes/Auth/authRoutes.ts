import { Request, Response, Router, NextFunction } from "express"
import { AuthRoutesI } from "../../../../Interfaces/Presentation/Routes/Auth/authRoutesInterface"
import { AuthControllerI } from "../../../../Interfaces/Presentation/Controllers/authControllerInterface"
import {
  loginValidator,
  refreshTokenValidator,
} from "../../Validators/authValidators"

export class AuthRoutes implements AuthRoutesI {
  private authController: AuthControllerI<Request, Response>

  constructor(_authController: AuthControllerI<Request, Response>) {
    this.authController = _authController
  }

  public registerRoutes(): Router {
    const router = Router()
    const installLoginRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.login(req, res, next)
    const installLogoutRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.logout(req, res, next)
    const installRefreshTokenRoute = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => this.refreshToken(req, res, next)

    router.post("/login", loginValidator, installLoginRoute)
    router.post("/logout/:id", installLogoutRoute)
    router.post(
      "/refreshToken",
      refreshTokenValidator,
      installRefreshTokenRoute
    )
    return router
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const token = await this.authController.Login(req, res)
      return res.json({ result: token })
    } catch (error) {
      return next(error)
    }
  }

  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.authController.Logout(req, res)
      return res.json({})
    } catch (error) {
      return next(error)
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const newToken = await this.authController.RefreshToken(req, res)
      return res.json({ result: { token: newToken } })
    } catch (error) {
      return next(error)
    }
  }
}
