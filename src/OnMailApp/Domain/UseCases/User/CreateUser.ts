import { DynamicUser, User } from "../../Entities/User"
import { UsersRepository } from "../../Repositories/UsersRepository"
import { AuthRepository } from "../../Repositories/AuthRepository"

export interface CreateUserUseCaseI {
  invoke: (user: DynamicUser) => Promise<User>
}

export class CreateUserUseCase implements CreateUserUseCaseI {
  public usersRepository: UsersRepository
  public authRepository: AuthRepository

  constructor(
    _userRepository: UsersRepository,
    _authRepository: AuthRepository
  ) {
    this.usersRepository = _userRepository
    this.authRepository = _authRepository
  }

  public async invoke(user: DynamicUser) {
    user.password = await this.authRepository.hash(user.password as string)
    return await this.usersRepository.create(user)
  }
}
