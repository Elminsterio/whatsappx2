import { User } from "../Entities/User";

export interface UsersRepository {
     get(): Promise<User[]>;
     getById(id: any): Promise<User>;
     getByEmail(email: any): Promise<User>;
     create(user: User): Promise<User>;
     edit(id: any, user: User): Promise<User>;
     delete(id: any): Promise<User>;
}