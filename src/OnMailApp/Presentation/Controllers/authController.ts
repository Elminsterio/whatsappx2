import { AuthControllerI } from "../../../Interfaces/Presentation/Controllers/authControllerInterface"
import { LoginUseCaseI } from "../../Domain/UseCases/Auth/Login"
import { Request, Response } from "express"
import { LogoutUseCaseI } from "../../Domain/UseCases/Auth/Logout"
import { RefreshTokenUseCaseI } from "../../Domain/UseCases/Auth/RefreshToken"
import { validationResult } from "express-validator"
import { MultipleValidationDataError, UnathorizedError, ValidationDataError } from "../../Domain/Entities/Errors"

export class AuthController implements AuthControllerI<Request, Response> {
  loginUseCase: LoginUseCaseI
  logoutUseCase: LogoutUseCaseI
  refreshTokenUseCase: RefreshTokenUseCaseI

  constructor(
    _loginUseCase: LoginUseCaseI,
    _logoutUseCase: LogoutUseCaseI,
    _refreshTokenUseCase: RefreshTokenUseCaseI
  ) {
    this.loginUseCase = _loginUseCase
    this.logoutUseCase = _logoutUseCase
    this.refreshTokenUseCase = _refreshTokenUseCase
  }

  async Login(req: Request, res: Response) {
    const errors = validationResult(req)
    const messageError = JSON.stringify(errors.array())

    if (!errors.isEmpty()) throw new MultipleValidationDataError(messageError)

    const { email, password } = req.body
    return await this.loginUseCase.invoke(email, password)
  }

  async Logout(req: Request, res: Response) {
    const { id } = req.params
    const token = req.get("Authorization")
    if(!token) throw new UnathorizedError("Bearer token is not provided or is invalid")

    return await this.logoutUseCase.invoke(id, token)
  }

  async RefreshToken(req: Request, res: Response) {
    const errors = validationResult(req)
    const messageError = JSON.stringify(errors.array())

    if (!errors.isEmpty()) throw new ValidationDataError('Please enter a token')

    const { refreshToken } = req.body

    return await this.refreshTokenUseCase.invoke(refreshToken)
  }
}
