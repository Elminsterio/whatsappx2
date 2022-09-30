import { Schema, model, Model } from "mongoose"
import { RefreshToken } from "../../../../Domain/Entities/RefreshToken"
import { User } from "../../../../Domain/Entities/User"
import { RefreshTokenModelI } from "../../../Interfaces/DataSources/Mongodb/RefreshTokenInterface"

export class RefreshTokenModel implements RefreshTokenModelI {
  private refreshTokenSchema: Schema
  public model: Model<RefreshToken<User>>

  constructor() {
    this.refreshTokenSchema = new Schema<RefreshToken<User>>({
      token: {
        type: String,
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    })

    this.model = model<RefreshToken<User>>("User", this.refreshTokenSchema)
  }
}
