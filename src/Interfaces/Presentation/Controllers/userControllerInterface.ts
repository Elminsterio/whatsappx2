import { User } from "../../../OnMailApp/Domain/Entities/User";

export interface UserControllerI<T, P> {
  getUsers: (req: T, res: P) => Promise<User[]>
  createUser: (req: T, res: P) => Promise<User>
  getUserById: (req: T, res: P) => Promise<User>
  updateUser: (req: T, res: P) => Promise<User>
  deleteUser: (req: T, res: P) => void
}