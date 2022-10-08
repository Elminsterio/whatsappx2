import { User, DynamicUser } from "../Entities/User"

export interface UsersRepository {
  get(): Promise<User[]>
  getById(id: any): Promise<User>
  getByEmail(email: string): Promise<User>
  create(user: DynamicUser): Promise<User>
  edit(id: any, user: DynamicUser): Promise<User>
  delete(id: any): Promise<User>
}
