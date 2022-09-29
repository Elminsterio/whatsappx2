import { User } from "../../Entities/User";
import { UsersRepository } from "../../Repositories/UsersRepository";
import { ErrorPwdOrUserNotFound } from "../../Entities/Errors";
import { AuthRepository } from "Domain/Repositories/AuthRepository";

export interface LoginUseCaseI {
  invoke: (email: User['email'], password: User['password']) => object
}

export class LoginUseCase implements LoginUseCaseI {
  public usersRepository: UsersRepository;
  public authRepository: AuthRepository;
  
  constructor(_userRepository: UsersRepository,
              _authRepository: AuthRepository) {
    this.usersRepository = _userRepository;
    this.authRepository = _authRepository;
  }

  public async invoke(email: User['email'], password: User['password']) {
    const userExist: User = await this.usersRepository.getByEmail(email);
    if (!userExist) throw new ErrorPwdOrUserNotFound('Password or user is incorrect');

    const correctPassword = await this.authRepository.compareHashes(password, userExist.password);
    if(!correctPassword) throw new ErrorPwdOrUserNotFound('Password or user is incorrect');
   
    const token = this.authRepository.signToken(userExist);
    return { token, userExist }
  } 
}