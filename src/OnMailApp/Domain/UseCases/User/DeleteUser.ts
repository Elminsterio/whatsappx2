import { User } from '../../Entities/User';
import { UsersRepository } from '../../Repositories/UsersRepository';

export interface DeleteUserUseCaseI {
  invoke: (id: User['_id']) => Promise<User>
}

export class DeleteUserUseCase implements DeleteUserUseCaseI {
  public usersRepository: UsersRepository;
  
  constructor(_userRepository: UsersRepository) {
    this.usersRepository = _userRepository;
  }

  public async invoke(id: User['_id']) {
    return await this.usersRepository.delete(id);
  } 
}