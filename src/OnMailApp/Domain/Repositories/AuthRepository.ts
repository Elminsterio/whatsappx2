import { RefreshToken } from "../Entities/RefreshToken"
import { User } from "../Entities/User"

export interface AuthRepository {
  genSalt(): Promise<string> | string
  hash(password: string): Promise<string> | string
  compareHashes(
    passwordIn: string,
    passwordKept: string
  ): Promise<boolean> | boolean
  signToken(user: User): string
  signRefreshToken(): string
  verifyToken(token: string): object
  verifyRefreshToken(refreshToken: string): object
  createRefreshToken(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
  getRefreshTokenByUserId(
    userId: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
  getRefreshTokenByToken(
    refreshToken: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
  updateRefreshToken(
    refreshToken: RefreshToken<User> | RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
}
