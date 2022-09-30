import { User } from "../../Entities/User"
import { AuthRepository } from "../../Repositories/AuthRepository"
import { UsersRepository } from "../../Repositories/UsersRepository"

export interface GetUserByIdUseCaseI {
  invoke: (id: User["_id"], token: string) => Promise<User>
}

export class GetUserByIdUseCase implements GetUserByIdUseCaseI {
  public usersRepository: UsersRepository
  public authRepository: AuthRepository

  constructor(
    _userRepository: UsersRepository,
    _authRepository: AuthRepository
  ) {
    this.usersRepository = _userRepository
    this.authRepository = _authRepository
  }

  public async invoke(id: User["_id"], token: string) {
    this.authRepository.verifyToken(token)
    return await this.usersRepository.getById(id)
  }
}
