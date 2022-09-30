import { Router } from "express";

export interface BaseRouteI {
  registerRoutes: (app: any, router: Router) => Router
}

