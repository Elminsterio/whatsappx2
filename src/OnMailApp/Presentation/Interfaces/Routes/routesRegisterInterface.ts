import { Router, Application } from "express";

export interface RoutesRegisterI {
  app: Application;
  registerAllRoutes: () => Router
}
