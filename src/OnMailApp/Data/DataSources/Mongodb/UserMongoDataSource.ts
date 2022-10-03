import { User } from "../../../Domain/Entities/User"
import UserDataSource from "../../Interfaces/DataSources/UserDataSource"
import { UserModelI } from "../../Interfaces/DataSources/Mongodb/UserModelInterface"
import { Types } from "mongoose"
import {
  ErrorBDEntityFound,
  ErrorBDEntityNotFound,
} from "../../../Domain/Entities/Errors"

export default class UserMongoDataSourceImpl implements UserDataSource {
  public userModel: any

  constructor(userModel: UserModelI) {
    this.userModel = userModel.model
  }

  async create(user: User): Promise<User> {
    const isUserOnDB = await this.userModel.find({ email: user.email })
    if (isUserOnDB.length)
      throw new ErrorBDEntityFound("User already exists on database")

    const newUser = new this.userModel(user)
    newUser.browserConfigPath = newUser._id
    return await newUser.save()
  }

  async get(): Promise<User[]> {
    return await this.userModel.find({})
  }

  async getById(id: Types.ObjectId): Promise<User> {
    const userOnDB = await this.userModel.findById({ _id: id })
    if (!userOnDB) throw new ErrorBDEntityNotFound("This user doesn't exist")
    return userOnDB
  }

  async getByEmail(email: string): Promise<User> {
    const userOnDB = await this.userModel.find({ email })
    return userOnDB[0]
  }

  async edit(id: Types.ObjectId, user: User): Promise<User> {
    const userOnDB = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    })
    if (!userOnDB) throw new ErrorBDEntityNotFound("This user doesn't exist")
    return userOnDB
  }

  async delete(id: Types.ObjectId): Promise<User> {
    const userOnDB = await this.userModel.findByIdAndDelete(id, {
      runValidators: true,
    })
    if (!userOnDB) throw new ErrorBDEntityNotFound("This user doesn't exist")
    return await userOnDB
  }
}
