import { Request, Response, NextFunction } from "express"

export class ErrorHandler {
  static manageError(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.log(error)
    const msg = error.message
    switch (error.name) {
      case "Not Authenticated":
        res.status(401).json({ error: msg })
        break
      case "ErrorPwdOrUserNotFound":
        res.status(error.status).json({ error: msg })
        break
      case "ErrorBDEntityNotFound":
        res.status(error.status).json({ error: msg })
        break
      case "ErrorBDEntityFound":
        res.status(error.status).json({ error: msg })
        break
      case "UnathorizedError":
        res.status(error.status).json({ error: msg })
        break
      case "OfferStatusError":
        res.status(error.status).json({ error: msg })
        break
      case "ValidationDataError":
        res.status(error.status).json({ error: msg })
        break
      case "MultipleValidationDataError":
        const messageErrorParsed = JSON.parse(error.message)
        res.status(error.status).json({ errors: messageErrorParsed })
        break
      case "ValidationError":
        res.status(400).json({ error: msg })
        break
      case "InsufficientPermisionError":
        res.status(error.status).json({ error: msg })
        break
      case "ErrorLimitRateExceeded":
        res.status(error.status).json({ error: msg })
        break
      case "MulterError":
        res.status(400).json({ error: msg })
        break
      case "CastError":
        res.status(400).json({ error: "The ObjectID introduced is not valid" })
        break
      case "MongoServerError":
        res.status(400).json({ error: msg })
        break
      case "MongooseServerSelectionError":
        res.status(500).json({
          error: "Database is not working, please, try again in few minutes",
        })
        break
      case "TokenExpiredError":
        res.status(401).json({ error: msg })
        break
      case "JsonWebTokenError":
        res.status(400).json({ error: msg })
        break
      case "NotBeforeError":
        res.status(400).json({ error: msg })
        break
      default:
        res.status(500).json({ error: "Internal Server Error" })
        break
    }
  }
}
