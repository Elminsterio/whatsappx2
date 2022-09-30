import { AuthRoleRepository } from "../../Domain/Repositories/AuthRoleRepository"
import { InsufficientPermisionError } from "../../Domain/Entities/Errors"

export class AuthRoleRepositoryImpl implements AuthRoleRepository {
  checkIsOwnId(tokenDecoded: any, id: string): boolean {
    if (tokenDecoded?._id === id) {
      return true
    } else {
      throw new InsufficientPermisionError(
        "You are not authorized to perform this action"
      )
    }
  }
}
