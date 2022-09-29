import { User } from '../../Entities/User';
import { UsersRepository } from '../../Repositories/UsersRepository';

export interface GetUsersUseCaseI {
  invoke: () => Promise<User[]>
}

export class GetUsersUseCase implements GetUsersUseCaseI {
  usersRepo: UsersRepository;
  
  constructor(_userRepo: UsersRepository) {
    this.usersRepo = _userRepo;
  }

  async invoke() {
    return await this.usersRepo.get();
  } 
}