import { User } from "../Entities/User"

export interface AuthRoleRepository {
  checkIsOwnId(tokenDecoded: any, userId: User["_id"]): boolean
  checkIsOwnTask(tokenDecoded: any, taskId: string): boolean
  checkIsWHAuthenticated(tokenDecoded: any): boolean
}
