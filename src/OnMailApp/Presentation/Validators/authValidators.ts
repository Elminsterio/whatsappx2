import { check } from "express-validator"

export const loginValidator = [
  check("email", "Email should be provided").isString().trim().escape(),
  check("password", "Password should be provided").isString().trim().escape(),
]

export const refreshTokenValidator = [
  check("refreshToken", "Enter a correct token").isString().trim().escape(),
]
