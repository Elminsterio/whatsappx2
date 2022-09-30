import { RefreshToken } from "../../../Domain/Entities/RefreshToken"
import { User } from "../../../Domain/Entities/User"
import { RefreshTokenModelI } from "../../Interfaces/DataSources/Mongodb/RefreshTokenInterface"
import RefreshTokenDataSource from "../../Interfaces/DataSources/RefreshTokenDataSource"

export class RefreshTokenMongoDataSource implements RefreshTokenDataSource {
  public refreshTokenModel: any

  constructor(refreshTokenModel: RefreshTokenModelI) {
    this.refreshTokenModel = refreshTokenModel.model
  }

  async create(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> {
    const newRefreshToken = new this.refreshTokenModel({
      token: refreshToken,
      user: userId,
    })
    return await newRefreshToken.save()
  }

  async getByuserId(userId: string): Promise<RefreshToken<User>> {
    return await this.refreshTokenModel.findOne({ user: userId })
  }

  async updateToken(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> {
    const refreshTokenStored = await this.refreshTokenModel.findOne({
      user: userId,
    })
    refreshTokenStored.token = refreshToken
    return await refreshTokenStored.save()
  }
}
