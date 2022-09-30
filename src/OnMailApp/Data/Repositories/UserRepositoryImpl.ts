import { User } from "../../Domain/Entities/User";
import { UsersRepository } from "../../Domain/Repositories/UsersRepository";
import UserDataSource from "../Interfaces/DataSources/UserDataSource";
import { Types } from "mongoose";

export class UserRepositoryImpl implements UsersRepository {
  public dataSource: UserDataSource;

  constructor(_datasource: UserDataSource) {
    this.dataSource = _datasource;
  }

  async get(): Promise<User[]> {
    return await this.dataSource.get();
  }

  async getById(id: Types.ObjectId): Promise<User> {
    return await this.dataSource.getById(id);
  }

  async getByEmail(email: string): Promise<User> {
    return await this.dataSource.getByEmail(email);
  }

  async create(user: User): Promise<User> {
    return await this.dataSource.create(user);
  }

  async edit(id: Types.ObjectId, user: User): Promise<User> {
    return await this.dataSource.edit(id, user);
  }

  async delete(id: Types.ObjectId): Promise<User> {
    return await this.dataSource.delete(id);
  }
}