import { UserRoutes } from "./User/userRoutes"
import { Express, Application } from "express"
import { RoutesRegisterI } from "../../../Interfaces/Presentation/Routes/routesRegisterInterface"
import { AuthRoutes } from "./Auth/authRoutes"
import { TaskRoutes } from "./Task/taskRoutes"
import { authController, taskController, userController } from "../../instances"

export class RoutesRegister implements RoutesRegisterI {
  app: Express

  constructor(app: Express) {
    this.app = app
  }

  public registerAllRoutes(): Application {
    const userRoutes: UserRoutes = new UserRoutes(userController)
    const authRoutes: AuthRoutes = new AuthRoutes(authController)
    const taskRoutes: TaskRoutes = new TaskRoutes(taskController)

    this.app.use("/api/user", userRoutes.registerRoutes())
    this.app.use("/api/auth", authRoutes.registerRoutes())
    this.app.use("/api/task", taskRoutes.registerRoutes())
    this.app.get("/*", function (req, res) {
      res.send("")
    })

    return this.app
  }
}
