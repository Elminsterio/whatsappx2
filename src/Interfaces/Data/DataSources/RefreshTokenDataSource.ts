import { RefreshToken } from "../../../OnMailApp/Domain/Entities/RefreshToken"
import { User } from "../../../OnMailApp/Domain/Entities/User"

export default interface RefreshTokenDataSource {
  create(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
  getByuserId(userId: string): Promise<RefreshToken<User>> | RefreshToken<User>
  getByrefreshToken(
    refreshToken: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
  updateToken(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> | RefreshToken<User>
}
