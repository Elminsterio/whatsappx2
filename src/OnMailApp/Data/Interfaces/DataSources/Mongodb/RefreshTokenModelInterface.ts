import { RefreshToken } from "../../../../Domain/Entities/RefreshToken"
import { Model } from "mongoose"
import { User } from "../../../../Domain/Entities/User"

export interface RefreshTokenModelI {
  model: Model<RefreshToken<User>>
}
