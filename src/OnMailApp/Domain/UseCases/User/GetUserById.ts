import { User } from '../../Entities/User';
import { UsersRepository } from '../../Repositories/UsersRepository';

export interface GetUserByIdUseCaseI {
  invoke: (id: User['_id']) => Promise<User>
}

export class GetUserByIdUseCase implements GetUserByIdUseCaseI {
  public usersRepository: UsersRepository;
  
  constructor(_userRepository: UsersRepository) {
    this.usersRepository = _userRepository;
  }

  public async invoke(id: User['_id']) {
    return await this.usersRepository.getById(id);
  } 
}