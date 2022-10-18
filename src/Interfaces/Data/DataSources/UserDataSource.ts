import { User, DynamicUser } from "../../../OnMailApp/Domain/Entities/User"

export default interface UserDataSource {
  get(): Promise<User[]> | User[]
  getById(userId: any): Promise<User> | User
  getByEmail(email: string): Promise<User> | User
  create(user: DynamicUser): Promise<User> | User
  edit(userId: any, user: DynamicUser): Promise<User> | User
  delete(userId: any): Promise<User> | User
}
