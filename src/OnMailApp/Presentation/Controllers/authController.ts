import { AuthControllerI } from "../Interfaces/Controllers/authControllerInterface";
import { LoginUseCaseI } from "../../Domain/UseCases/Auth/Login";
import { Request, Response } from "express";


export class AuthController implements AuthControllerI<Request, Response> {
  loginUseCase: LoginUseCaseI

  constructor(
    _loginUseCase: LoginUseCaseI
  ) {
    this.loginUseCase = _loginUseCase;
  }

  async Login(req: Request, res: Response) {
    
    const { email, password } = req.body;
    return this.loginUseCase.invoke(email, password)
  }
  
  Logout(req: Request, res: Response) {

  }
}