import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { AuthRepository } from "../../Domain/Repositories/AuthRepository"
import { User } from "../../Domain/Entities/User"
import { UnathorizedError } from "../../Domain/Entities/Errors"
import { RefreshToken } from "../../Domain/Entities/RefreshToken"
import RefreshTokenDataSource from "../Interfaces/DataSources/RefreshTokenDataSource"

export class AuthRepositoryImpl implements AuthRepository {
  public dataSource: RefreshTokenDataSource

  constructor(_datasource: RefreshTokenDataSource) {
    this.dataSource = _datasource
  }

  async genSalt() {
    return await bcryptjs.genSalt(13)
  }

  async hash(password: string): Promise<string> {
    const salt = await this.genSalt()
    return await bcryptjs.hash(password, salt)
  }

  async compareHashes(
    passwordIn: string,
    passwordKept: string
  ): Promise<boolean> {
    return await bcryptjs.compare(passwordIn, passwordKept)
  }

  signToken(user: User): string {
    const { email, name, _id } = user
    const payload = { email, name, _id }
    return jwt.sign(payload, "secret", { expiresIn: 300 })
  }

  signRefreshToken(): string {
    return jwt.sign({}, "secret2", { expiresIn: "4d" })
  }

  verifyToken(bearerToken: string): any {
    const rawToken = bearerToken.split(" ")
    const token = rawToken[1]
    let tokenDecoded: any
    jwt.verify(token, "secret", (error, decoded) => {
      if (!decoded)
        throw new UnathorizedError("Bearer token is not provided or is invalid")
      else tokenDecoded = decoded
    })
    return tokenDecoded
  }

  verifyRefreshToken(refreshToken: string) {
    let tokenDecoded: any
    jwt.verify(refreshToken, "secret2", (error, decoded) => {
      if (!decoded)
        throw new UnathorizedError("refreshToken is not provided or is invalid")
      else tokenDecoded = decoded
    })
    return tokenDecoded
  }

  async getRefreshTokenByToken(refreshToken: string) {
    return await this.dataSource.getByrefreshToken(refreshToken)
  }

  async createRefreshToken(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> {
    return await this.dataSource.create(refreshToken, userId)
  }

  async getRefreshTokenByUserId(userId: string): Promise<RefreshToken<User>> {
    return await this.dataSource.getByuserId(userId)
  }

  async updateRefreshToken(
    refreshToken: RefreshToken<User>,
    userId: string
  ): Promise<RefreshToken<User>> {
    return await this.dataSource.updateToken(refreshToken, userId)
  }
}
