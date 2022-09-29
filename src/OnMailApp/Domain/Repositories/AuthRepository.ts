import { User } from "Domain/Entities/User";

export interface AuthRepository {
  genSalt(): Promise<string> | string;
  hash(password: string): Promise<string> | string;
  compareHashes(passwordIn: string, passwordKept: string): Promise<boolean> | boolean;
  signToken(user: User): string;
  verifyToken(token: string): void;
}