import { User } from "../../Entities/User"
import { UsersRepository } from "../../Repositories/UsersRepository"
import { ErrorPwdOrUserNotFound } from "../../Entities/Errors"
import { AuthRepository } from "../../../Domain/Repositories/AuthRepository"

export interface LoginUseCaseI {
  invoke: (email: User["email"], password: User["password"]) => object
}

export class LoginUseCase implements LoginUseCaseI {
  public usersRepository: UsersRepository
  public authRepository: AuthRepository

  constructor(
    _userRepository: UsersRepository,
    _authRepository: AuthRepository
  ) {
    this.usersRepository = _userRepository
    this.authRepository = _authRepository
  }

  public async invoke(email: User["email"], password: User["password"]) {
    const user: User = await this.usersRepository.getByEmail(email)
    if (!user) throw new ErrorPwdOrUserNotFound("Password or user is incorrect")

    const correctPassword = await this.authRepository.compareHashes(
      password,
      user.password
    )
    if (!correctPassword)
      throw new ErrorPwdOrUserNotFound("Password or user is incorrect")

    const refreshTokenExists =
      await this.authRepository.getRefreshTokenByUserId(user._id as any)

    const token = this.authRepository.signToken(user)
    const refreshToken = this.authRepository.signRefreshToken()

    if (refreshTokenExists) {
      await this.authRepository.updateRefreshToken(
        refreshToken as any,
        user._id as any
      )
    } else {
      await this.authRepository.createRefreshToken(
        refreshToken as any,
        user._id as any
      )
    }

    return { user, token, refreshToken }
  }
}
