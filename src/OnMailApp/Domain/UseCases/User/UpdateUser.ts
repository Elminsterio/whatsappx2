import { User } from '../../Entities/User';
import { UsersRepository } from '../../Repositories/UsersRepository';
import { AuthRepository } from '../../Repositories/AuthRepository';

export interface UpdateUserUseCaseI {
  invoke: (id: User['_id'], user: User) => Promise<User>
}

export class UpdateUserUseCase implements UpdateUserUseCaseI {
  public usersRepository: UsersRepository;
  public authRepository: AuthRepository;

  constructor(_userRepository: UsersRepository,
              _authRepository: AuthRepository) {
    this.usersRepository = _userRepository;
    this.authRepository = _authRepository;
  }

  public async invoke(id: User['_id'], user: User) {
    return await this.usersRepository.edit(id, user);
  } 
}