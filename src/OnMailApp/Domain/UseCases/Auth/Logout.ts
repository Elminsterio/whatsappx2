import { ErrorBDEntityNotFound } from "../../Entities/Errors"
import { User } from "../../Entities/User"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"

export interface LogoutUseCaseI {
  invoke: (userId: User["_id"], token: string) => void
}

export class LogoutUseCase implements LogoutUseCaseI {
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository

  constructor(
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository
  ) {
    this.authRepository = _authRepository
    this.authRoleRepository = _authRoleRepository
  }

  async invoke(userId: User["_id"], token: string) {
    const tokenDecoded: object | undefined =
      this.authRepository.verifyToken(token)

    this.authRoleRepository.checkIsOwnId(tokenDecoded, userId)

    const refreshToken: any = await this.authRepository.getRefreshTokenByUserId(
      userId as any
    )
    if (!refreshToken)
      throw new ErrorBDEntityNotFound("This refreshToken doesn't exist")
    await this.authRepository.updateRefreshToken("" as any, userId as any)
  }
}
