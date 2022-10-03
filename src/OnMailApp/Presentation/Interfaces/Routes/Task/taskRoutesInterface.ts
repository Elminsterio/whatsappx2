import { BaseRouteI } from "../baseRouteInterface";
import { Request, Response, NextFunction } from "express";

export interface TaskRoutesI extends BaseRouteI {
  writeMessage: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
}
