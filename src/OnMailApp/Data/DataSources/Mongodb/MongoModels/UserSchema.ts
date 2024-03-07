import { Schema, model, Model } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"
import { User } from "../../../../Domain/Entities/User"
import { UserModelI } from "../../../../../Interfaces/Data/DataSources/Mongodb/UserModelInterface"

export class UserModel implements UserModelI {
  public userSchema: Schema
  public model: Model<User>

  constructor() {
    this.userSchema = new Schema<User>({
      creationDate: { type: Date, default: Date.now },
      email: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      password: { type: String, required: true },
      active: { type: Boolean, default: true },
      browserConfigPath: { type: String },
      tasks: { type: Array },
      isAuth: { type: Boolean, default: false }
    })

    this.userSchema.methods.toJSON = function () {
      let user = this
      let userObject = user.toObject()
      delete userObject.password
      delete userObject.browserConfigPath

      return userObject
    }

    this.userSchema.plugin(uniqueValidator, {
      message: "{PATH} must be unique",
    })

    this.model = model<User>("User", this.userSchema)
  }
}
