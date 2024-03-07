import { check } from "express-validator"

export const createUserValidator = [
  check("email", "Enter a valid username").trim().escape(),
  check("password", "Password must be a minimum of 8 characters")
    .isLength({
      min: 8,
      max: 20,
    })
    .trim()
    .escape(),
  check("age", "Enter a number").optional().isNumeric().escape(),
  check("name", "Enter a name").trim().escape(),
  check(
    "verified",
    "You cannot modify this attribute, please contact with an admin"
  )
    .optional()
    .isBoolean()
    .custom((bool) => !bool),
]

export const updateUserValidator = [
  check("email", "Enter a valid username").optional().trim().escape(),
  check("password", "Password must be a minimum of 8 characters")
    .optional()
    .isLength({
      min: 8,
      max: 20,
    })
    .trim()
    .escape(),
  check("age", "Enter a number").optional().isNumeric().escape(),
  check("DNI", "Please check the DNI or NIE introduced")
    .optional()
    .trim()
    .escape(),
  check("name", "Enter a pseudonym").optional().trim().escape(),
  check(
    "verified",
    "You cannot modify this attribute, please contact with an admin"
  )
    .optional()
    .isBoolean()
    .custom((bool) => !bool),
]
