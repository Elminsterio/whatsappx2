import { BaseRouteI } from "../baseRouteInterface";
import { Request, Response, NextFunction } from "express";

export interface AuthRoutesI extends BaseRouteI {
  login: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
  logout: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}