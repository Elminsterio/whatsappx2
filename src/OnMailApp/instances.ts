import { TaskManager } from "../Scraper/TaskManager"
import { Tasks } from "../Scraper/Tasks"
import { RefreshTokenModel } from "./Data/DataSources/Mongodb/MongoModels/RefreshTokenSchema"
import { TaskModel } from "./Data/DataSources/Mongodb/MongoModels/TaskSchema"
import { UserModel } from "./Data/DataSources/Mongodb/MongoModels/UserSchema"
import { RefreshTokenMongoDataSource } from "./Data/DataSources/Mongodb/RefreshTokenMongoDataSource"
import TaskDataSourceImpl from "./Data/DataSources/Mongodb/TaskDataSource"
import UserMongoDataSourceImpl from "./Data/DataSources/Mongodb/UserMongoDataSource"
import { AuthRepositoryImpl } from "./Data/Repositories/AuthRepositoryImpl"
import { AuthRoleRepositoryImpl } from "./Data/Repositories/AuthRoleImpl"
import { TaskRepositoryImpl } from "./Data/Repositories/TaskRepositoryImpl"
import { UserRepositoryImpl } from "./Data/Repositories/UserRepositoryImpl"
import { LoginUseCase } from "./Domain/UseCases/Auth/Login"
import { LogoutUseCase } from "./Domain/UseCases/Auth/Logout"
import { RefreshTokenUseCase } from "./Domain/UseCases/Auth/RefreshToken"
import { WriteMessageUseCase } from "./Domain/UseCases/Tasks/CreateWriteMessage"
import { GetUserTasksUseCase } from "./Domain/UseCases/Tasks/GetUserTasks"
import { RegisterSesionUseCase } from "./Domain/UseCases/Tasks/RegisterSesion"
import { CreateUserUseCase } from "./Domain/UseCases/User/CreateUser"
import { DeleteUserUseCase } from "./Domain/UseCases/User/DeleteUser"
import { GetUserByIdUseCase } from "./Domain/UseCases/User/GetUserById"
import { GetUsersUseCase } from "./Domain/UseCases/User/GetUsers"
import { UpdateUserUseCase } from "./Domain/UseCases/User/UpdateUser"
import { AuthController } from "./Presentation/Controllers/authController"
import { TaskController } from "./Presentation/Controllers/taskController"
import { UserController } from "./Presentation/Controllers/userController"

export const models = {
  refreshTokenModel: new RefreshTokenModel(),
  taskModel: new TaskModel(),
  userModel: new UserModel(),
}

export const dataSources = {
  refreshTokenDataSource: new RefreshTokenMongoDataSource(
    models.refreshTokenModel
  ),
  userMongoDataSource: new UserMongoDataSourceImpl(models.userModel),
  taskDataSource: new TaskDataSourceImpl(models.taskModel, models.userModel),
}

export const taskManager = new TaskManager()
export const tasks = new Tasks()

export const repositories = {
  userRepo: new UserRepositoryImpl(dataSources.userMongoDataSource),
  authRepo: new AuthRepositoryImpl(dataSources.refreshTokenDataSource),
  authRoleRepo: new AuthRoleRepositoryImpl(),
  taskRepo: new TaskRepositoryImpl(
    dataSources.userMongoDataSource,
    dataSources.taskDataSource,
    tasks,
    taskManager
  ),
}

export const userUseCases = {
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
    repositories.taskRepo,
    repositories.authRepo,
    repositories.authRoleRepo
  ),
  getUserById: new GetUserByIdUseCase(
    repositories.userRepo,
    repositories.authRepo
  ),
}

export const authUseCases = {
  login: new LoginUseCase(repositories.userRepo, repositories.authRepo),
  logout: new LogoutUseCase(repositories.authRepo, repositories.authRoleRepo),
  refreshToken: new RefreshTokenUseCase(
    repositories.authRepo,
    repositories.authRoleRepo,
    repositories.userRepo
  ),
}

export const taskUseCases = {
  writeMessage: new WriteMessageUseCase(
    repositories.authRepo,
    repositories.authRoleRepo,
    repositories.taskRepo
  ),
  registerSesion: new RegisterSesionUseCase(
    repositories.authRepo,
    repositories.authRoleRepo,
    repositories.taskRepo,
    repositories.userRepo
  ),
  getTasksUseCase: new GetUserTasksUseCase(
    repositories.authRepo,
    repositories.authRoleRepo,
    repositories.taskRepo
  ),
}

export const userController: UserController = new UserController(
  userUseCases.getUser,
  userUseCases.createUser,
  userUseCases.updateUser,
  userUseCases.deleteUser,
  userUseCases.getUserById
)
export const authController: AuthController = new AuthController(
  authUseCases.login,
  authUseCases.logout,
  authUseCases.refreshToken
)

export const taskController: TaskController = new TaskController(
  taskUseCases.writeMessage,
  taskUseCases.registerSesion,
  taskUseCases.getTasksUseCase
)
