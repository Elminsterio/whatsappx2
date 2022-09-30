"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutesRegister = void 0;
require("module-alias/register");
const userRoutes_1 = require("./User/userRoutes");
const userController_1 = require("../Controllers/userController");
const GetUsers_1 = require("@Domain/UseCases/User/GetUsers");
const CreateUser_1 = require("@Domain/UseCases/User/CreateUser");
const authController_1 = require("../Controllers/authController");
const Login_1 = require("@Domain/UseCases/Auth/Login");
const authRoutes_1 = require("./Auth/authRoutes");
const UpdateUser_1 = require("@Domain/UseCases/User/UpdateUser");
const DeleteUser_1 = require("@Domain/UseCases/User/DeleteUser");
const GetUserById_1 = require("@Domain/UseCases/User/GetUserById");
const AuthRepositoryImpl_1 = require("@Data/Repositories/AuthRepositoryImpl");
class RoutesRegister {
    constructor(app) {
        this.app = app;
    }
    registerAllRoutes() {
        const repositories = {
            userRepo: userRoutes_1.UserRoutes.userRepo,
            authRepo: new AuthRepositoryImpl_1.AuthRepositoryImpl(),
        };
        const userUseCases = {
            getUser: new GetUsers_1.GetUsersUseCase(repositories.userRepo),
            createUser: new CreateUser_1.CreateUserUseCase(repositories.userRepo, repositories.authRepo),
            updateUser: new UpdateUser_1.UpdateUserUseCase(repositories.userRepo, repositories.authRepo),
            deleteUser: new DeleteUser_1.DeleteUserUseCase(repositories.userRepo),
            getUserById: new GetUserById_1.GetUserByIdUseCase(repositories.userRepo),
        };
        const loginUseCases = {
            login: new Login_1.LoginUseCase(repositories.userRepo, repositories.authRepo),
        };
        const userCont = new userController_1.UserController(userUseCases.getUser, userUseCases.createUser, userUseCases.updateUser, userUseCases.deleteUser, userUseCases.getUserById);
        const authCont = new authController_1.AuthController(loginUseCases.login);
        const userRoutes = new userRoutes_1.UserRoutes(userCont);
        const authRoutes = new authRoutes_1.AuthRoutes(authCont);
        this.app.use("/api/user", userRoutes.registerRoutes());
        this.app.use("/api/auth", authRoutes.registerRoutes());
        return this.app;
    }
}
exports.RoutesRegister = RoutesRegister;
