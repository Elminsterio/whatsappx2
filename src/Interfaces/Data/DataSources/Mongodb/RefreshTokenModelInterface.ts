import { RefreshToken } from "../../../../OnMailApp/Domain/Entities/RefreshToken"
import { Model } from "mongoose"
import { User } from "../../../../OnMailApp/Domain/Entities/User"

export interface RefreshTokenModelI {
  model: Model<RefreshToken<User>>
}
