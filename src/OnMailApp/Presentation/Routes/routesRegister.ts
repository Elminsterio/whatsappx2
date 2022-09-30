import "module-alias/register"
import { UserRoutes } from "./User/userRoutes"
import { Express, Application } from "express"
import { UserController } from "../Controllers/userController"
import { GetUsersUseCase } from "../../Domain/UseCases/User/GetUsers"
import { CreateUserUseCase } from "../../Domain/UseCases/User/CreateUser"
import { RoutesRegisterI } from "../Interfaces/Routes/routesRegisterInterface"
import { AuthController } from "../Controllers/authController"
import { LoginUseCase } from "../../Domain/UseCases/Auth/Login"
import { AuthRoutes } from "./Auth/authRoutes"
import { UpdateUserUseCase } from "../../Domain/UseCases/User/UpdateUser"
import { DeleteUserUseCase } from "../../Domain/UseCases/User/DeleteUser"
import { GetUserByIdUseCase } from "../../Domain/UseCases/User/GetUserById"
import { AuthRepositoryImpl } from "../../Data/Repositories/AuthRepositoryImpl"
import { AuthRoleRepositoryImpl } from "../../Data/Repositories/AuthRoleImpl"

export class RoutesRegister implements RoutesRegisterI {
  app: Express

  constructor(app: Express) {
    this.app = app
  }

  public registerAllRoutes(): Application {
    const repositories = {
      userRepo: UserRoutes.userRepo,
      authRepo: new AuthRepositoryImpl(),
      authRoleRepo: new AuthRoleRepositoryImpl()
    }

    const userUseCases = {
      getUser: new GetUsersUseCase(repositories.userRepo),
      createUser: new CreateUserUseCase(
        repositories.userRepo,
        repositories.authRepo
      ),
      updateUser: new UpdateUserUseCase(
        repositories.userRepo,
        repositories.authRepo,
        repositories.authRoleRepo
      ),
      deleteUser: new DeleteUserUseCase(
        repositories.userRepo,
        repositories.authRepo
      ),
      getUserById: new GetUserByIdUseCase(
        repositories.userRepo,
        repositories.authRepo
      ),
    }

    const loginUseCases = {
      login: new LoginUseCase(repositories.userRepo, repositories.authRepo),
    }

    const userCont: UserController = new UserController(
      userUseCases.getUser,
      userUseCases.createUser,
      userUseCases.updateUser,
      userUseCases.deleteUser,
      userUseCases.getUserById
    )
    const authCont: AuthController = new AuthController(loginUseCases.login)

    const userRoutes: UserRoutes = new UserRoutes(userCont)
    const authRoutes: AuthRoutes = new AuthRoutes(authCont)

    this.app.use("/api/user", userRoutes.registerRoutes())
    this.app.use("/api/auth", authRoutes.registerRoutes())

    return this.app
  }
}
