import { User } from "../../../Domain/Entities/User";

export default interface UserDataSource {
  get(): Promise<User[]> | User[];
  getById(id: any): Promise<User> | User;
  getByEmail(email: string): Promise<User> | User;
  create(user: User): Promise<User> | User;
  edit(id: any, user: User): Promise<User> | User;
  delete(id: any): Promise<User> | User;
}