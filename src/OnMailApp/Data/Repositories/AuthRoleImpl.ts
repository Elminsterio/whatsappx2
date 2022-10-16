import { AuthRoleRepository } from "../../Domain/Repositories/AuthRoleRepository"
import { InsufficientPermisionError } from "../../Domain/Entities/Errors"
import { User } from "../../Domain/Entities/User"

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

  checkIsOwnTask(user: User, taskId: string): boolean {
    if (user.tasks?.includes(taskId)) {
      return true
    } else {
      throw new InsufficientPermisionError(
        "You are not authorized to perform this action"
      )
    }
  }

  checkIsWHAuthenticated(user: User): boolean {
    if (user.isAuth === true) {
      return true
    } else {
      throw new InsufficientPermisionError(
        "You are not authenticated on WhatsApp"
      )
    }
  }
}
