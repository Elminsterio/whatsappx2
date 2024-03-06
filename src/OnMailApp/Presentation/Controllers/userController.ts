import { GetUsersUseCaseI } from "../../Domain/UseCases/User/GetUsers"
import { CreateUserUseCaseI } from "../../Domain/UseCases/User/CreateUser"
import { Request, Response } from "express"
import { DynamicUser } from "../../Domain/Entities/User"
import { UserControllerI } from "../../../Interfaces/Presentation/Controllers/userControllerInterface"
import { validationResult } from "express-validator"
import { MultipleValidationDataError, UnathorizedError } from "../../Domain/Entities/Errors"
import { UpdateUserUseCaseI } from "../../Domain/UseCases/User/UpdateUser"
import { DeleteUserUseCaseI } from "../../Domain/UseCases/User/DeleteUser"
import { GetUserByIdUseCaseI } from "../../Domain/UseCases/User/GetUserById"

export class UserController implements UserControllerI<Request, Response> {
  getUserUseCase: GetUsersUseCaseI
  createUserUseCase: CreateUserUseCaseI
  updateUserUseCase: UpdateUserUseCaseI
  deleteUserUseCase: DeleteUserUseCaseI
  getUserByIdUseCase: GetUserByIdUseCaseI

  constructor(
    _getUserUseCase: GetUsersUseCaseI,
    _createUserUseCase: CreateUserUseCaseI,
    _updateUserUseCase: UpdateUserUseCaseI,
    _deleteUserUseCase: DeleteUserUseCaseI,
    _getUserByIdUseCase: GetUserByIdUseCaseI
  ) {
    this.getUserUseCase = _getUserUseCase
    this.createUserUseCase = _createUserUseCase
    this.updateUserUseCase = _updateUserUseCase
    this.deleteUserUseCase = _deleteUserUseCase
    this.getUserByIdUseCase = _getUserByIdUseCase
  }

  async getUsers(req: Request, res: Response) {
    return await this.getUserUseCase.invoke()
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if(!token) throw new UnathorizedError("Bearer token is not provided or is invalid")
  
    return await this.getUserByIdUseCase.invoke(id, token)
  }

  async updateUser(req: Request, res: Response) {
    const errors = validationResult(req)
    const messageError = JSON.stringify(errors.array())

    if (!errors.isEmpty()) throw new MultipleValidationDataError(messageError)

    const { id } = req.params
    const { name, email, password } = req.body
    const token = req.get("Authorization")
    if(!token) throw new UnathorizedError("Bearer token is not provided or is invalid")

    const user: DynamicUser = { name, email, password }
    return await this.updateUserUseCase.invoke(id, user, token)
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if(!token) throw new UnathorizedError("Bearer token is not provided or is invalid")

    return await this.deleteUserUseCase.invoke(id, token)
  }

  async createUser(req: Request, res: Response) {
    const errors = validationResult(req)
    const messageError = JSON.stringify(errors.array())

    if (!errors.isEmpty()) throw new MultipleValidationDataError(messageError)

    const { name, email, password } = req.body
    const user: DynamicUser = {
      name,
      email,
      password
    }

    return await this.createUserUseCase.invoke(user)
  }
}
