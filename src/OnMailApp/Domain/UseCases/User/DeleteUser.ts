import { User } from "../../Entities/User"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { AuthRoleRepository } from "../../Repositories/AuthRoleRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface DeleteUserUseCaseI {
  invoke: (id: User["_id"], token: string) => Promise<User>
}

export class DeleteUserUseCase implements DeleteUserUseCaseI {
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

  public async invoke(id: User["_id"], token: string) {
    const tokenDecoded: any = this.authRepository.verifyToken(token)
    this.authRoleRepository.checkIsOwnId(tokenDecoded, id)
    return await this.usersRepository.delete(id)
  }
}
