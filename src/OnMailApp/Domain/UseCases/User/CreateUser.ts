import { User } from '../../Entities/User';
import { UsersRepository } from '../../Repositories/UsersRepository';
import { AuthRepository } from '../../Repositories/AuthRepository';

export interface CreateUserUseCaseI {
  invoke: (user: User) => Promise<User>
}

export class CreateUserUseCase implements CreateUserUseCaseI {
  public usersRepository: UsersRepository;
  public authRepository: AuthRepository;

  constructor(_userRepository: UsersRepository,
              _authRepository: AuthRepository) {
    this.usersRepository = _userRepository;
    this.authRepository = _authRepository;
  }

  public async invoke(user: User) {
    user.password = await this.authRepository.hash(user.password);
    return await this.usersRepository.create(user);
  } 
}