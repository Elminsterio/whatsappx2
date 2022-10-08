import { BaseRouteI } from "../baseRouteInterface";
import { Request, Response, NextFunction } from "express";

export interface UserRoutesI extends BaseRouteI {
  getUsers: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  createUser: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  getUserById: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  updateUser: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
