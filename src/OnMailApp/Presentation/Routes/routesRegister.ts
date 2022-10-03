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
import { RefreshTokenMongoDataSource } from "../../Data/DataSources/Mongodb/RefreshTokenMongoDataSource"
import { RefreshTokenModel } from "../../Data/DataSources/Mongodb/MongoModels/RefreshTokenSchema"
import { LogoutUseCase } from "../../Domain/UseCases/Auth/Logout"
import { RefreshTokenUseCase } from "../../Domain/UseCases/Auth/RefreshToken"
import { TaskRepositoryImpl } from "../../Data/Repositories/TaskRepositoryImpl"
import { TaskModel } from "../../Data/DataSources/Mongodb/MongoModels/TaskSchema"
import TaskDataSourceImpl from "../../Data/DataSources/Mongodb/TaskDataSource"
import { UserModel } from "../../Data/DataSources/Mongodb/MongoModels/UserSchema"
import UserMongoDataSourceImpl from "../../Data/DataSources/Mongodb/UserMongoDataSource"
import { UserRepositoryImpl } from "../../Data/Repositories/UserRepositoryImpl"
import { WriteMessageUseCase } from "../../Domain/UseCases/Tasks/CreateWriteMessage"
import { TaskController } from "../Controllers/taskController"
import { TaskRoutes } from "./Task/taskRoutes"
import { writeTask } from "../../../Scraper/Tasks"

export class RoutesRegister implements RoutesRegisterI {
  app: Express

  constructor(app: Express) {
    this.app = app
  }

  public registerAllRoutes(): Application {
    const models = {
      refreshTokenModel: new RefreshTokenModel(),
      taskModel: new TaskModel(),
      userModel: new UserModel(),
    }

    const dataSources = {
      refreshTokenDataSource: new RefreshTokenMongoDataSource(
        models.refreshTokenModel
      ),
      userMongoDataSource: new UserMongoDataSourceImpl(models.userModel),
      taskDataSource: new TaskDataSourceImpl(
        models.taskModel,
        models.userModel
      ),
    }

    const repositories = {
      userRepo: new UserRepositoryImpl(dataSources.userMongoDataSource),
      authRepo: new AuthRepositoryImpl(dataSources.refreshTokenDataSource),
      authRoleRepo: new AuthRoleRepositoryImpl(),
      taskRepo: new TaskRepositoryImpl(
        dataSources.userMongoDataSource,
        dataSources.taskDataSource
      ),
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
        repositories.authRepo,
        repositories.authRoleRepo
      ),
      getUserById: new GetUserByIdUseCase(
        repositories.userRepo,
        repositories.authRepo
      ),
    }

    const authUseCases = {
      login: new LoginUseCase(repositories.userRepo, repositories.authRepo),
      logout: new LogoutUseCase(
        repositories.authRepo,
        repositories.authRoleRepo
      ),
      refreshToken: new RefreshTokenUseCase(
        repositories.authRepo,
        repositories.authRoleRepo,
        repositories.userRepo
      ),
    }

    const taskUseCases = {
      writeMessage: new WriteMessageUseCase(
        repositories.authRepo,
        repositories.authRoleRepo,
        repositories.taskRepo,
        writeTask
      ),
    }

    const userCont: UserController = new UserController(
      userUseCases.getUser,
      userUseCases.createUser,
      userUseCases.updateUser,
      userUseCases.deleteUser,
      userUseCases.getUserById
    )
    const authCont: AuthController = new AuthController(
      authUseCases.login,
      authUseCases.logout,
      authUseCases.refreshToken
    )

    const taskCont: TaskController = new TaskController(
      taskUseCases.writeMessage
    )

    const userRoutes: UserRoutes = new UserRoutes(userCont)
    const authRoutes: AuthRoutes = new AuthRoutes(authCont)
    const taskRoutes: TaskRoutes = new TaskRoutes(taskCont)

    this.app.use("/api/user", userRoutes.registerRoutes())
    this.app.use("/api/auth", authRoutes.registerRoutes())
    this.app.use("/api/task", taskRoutes.registerRoutes())

    return this.app
  }
}
