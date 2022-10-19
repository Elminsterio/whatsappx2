import { ErrorBDEntityNotFound, UnathorizedError } from "../../Entities/Errors"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface RefreshTokenUseCaseI {
  invoke: (refreshToken: string) => Promise<string>
}

export class RefreshTokenUseCase implements RefreshTokenUseCaseI {
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository
  public usersRepository: UsersRepository

  constructor(
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository,
    _usersRepository: UsersRepository
  ) {
    this.authRepository = _authRepository
    this.authRoleRepository = _authRoleRepository
    this.usersRepository = _usersRepository
  }

  async invoke(refreshToken: string): Promise<string> {
    const refreshTokenStored = await this.authRepository.getRefreshTokenByToken(
      refreshToken
    )
    console.log(refreshTokenStored)
    if (
      refreshTokenStored ??
      this.authRepository.verifyRefreshToken(refreshToken)
    ) {
      const user = await this.usersRepository.getById(refreshTokenStored.user)
      if (!user) throw new ErrorBDEntityNotFound("User doesn't exist")
      const newToken = this.authRepository.signToken(user)
      return newToken
    } else {
      throw new UnathorizedError(
        "RefreshToken has been expired or doesn't exist"
      )
    }
  }
}
