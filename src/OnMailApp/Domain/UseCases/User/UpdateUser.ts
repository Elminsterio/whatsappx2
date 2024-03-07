import { User, DynamicUser } from "../../Entities/User"
import { UsersRepository } from "../../Repositories/UsersRepository"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"

export interface UpdateUserUseCaseI {
  invoke: (id: string, user: DynamicUser, token: string) => Promise<User>
}

export class UpdateUserUseCase implements UpdateUserUseCaseI {
  public usersRepository: UsersRepository
  public authRepository: AuthRepository
  public authRoleRepository: AuthRoleRepository

  constructor(
    _userRepository: UsersRepository,
    _authRepository: AuthRepository,
    _authRoleRepository: AuthRoleRepository
  ) {
    this.usersRepository = _userRepository
    this.authRepository = _authRepository
    this.authRoleRepository = _authRoleRepository
  }

  public async invoke(id: string, user: DynamicUser, token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, id)
    return await this.usersRepository.edit(id, user)
  }
}
