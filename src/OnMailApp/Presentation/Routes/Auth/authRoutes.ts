import { Request, Response, Router, NextFunction } from 'express';
import { AuthRoutesI } from '../../Interfaces/Routes/Auth/authRoutesInterface';
import { AuthControllerI } from '../../Interfaces/Controllers/authControllerInterface';

export class AuthRoutes implements AuthRoutesI {
  private authController: AuthControllerI<Request, Response> 

  constructor(
    _authController: AuthControllerI<Request, Response>
  ) {
    this.authController = _authController;
  }

  public registerRoutes(): Router {
    const router = Router();
    const installLoginRoute = (req: Request, res: Response, next: NextFunction) => this.login(req, res, next);
    router.post('/login', installLoginRoute);
    
    return router;
  }
  
  async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const token = await this.authController.Login(req, res);
      return res.json({result: token});
    } catch(error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  }
} 