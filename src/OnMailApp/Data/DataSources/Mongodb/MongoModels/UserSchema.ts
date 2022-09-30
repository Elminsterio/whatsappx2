import { Schema, model, Model } from "mongoose"
import { User } from "../../../../Domain/Entities/User"
import { UserModelI } from "../../../Interfaces/DataSources/Mongodb/UserModelInterface"

export class UserModel implements UserModelI {
  private userSchema: Schema
  public model: Model<User>

  constructor() {
    this.userSchema = new Schema<User>({
      creationDate: { type: Date, default: Date.now },
      email: { type: String, required: true },
      name: { type: String, required: true },
      password: { type: String, required: true },
      active: { type: Boolean, default: true },
    })

    this.userSchema.methods.toJSON = function () {
      let user = this
      let userObject = user.toObject()
      delete userObject.password

      return userObject
    }

    this.model = model<User>("User", this.userSchema)
  }
}
