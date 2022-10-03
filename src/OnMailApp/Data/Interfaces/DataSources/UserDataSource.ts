import { User } from "../../../Domain/Entities/User"

export default interface UserDataSource {
  get(): Promise<User[]> | User[]
  getById(userId: any): Promise<User> | User
  getByEmail(email: string): Promise<User> | User
  create(user: User): Promise<User> | User
  edit(userId: any, user: User): Promise<User> | User
  delete(userId: any): Promise<User> | User
}
