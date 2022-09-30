import { User } from "../Entities/User"

export interface AuthRoleRepository {
  checkIsOwnId(tokenDecoded: any, id: User["_id"]): boolean
}
