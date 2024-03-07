import { check } from "express-validator"

export const createWriteTaskValidator = [
  check(
    "time",
    "The value introduced should be an cron based string or ISO8601 string"
  ).custom((value) => {
    const ISOdateRegexp = new RegExp(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      "gi"
    )
    const cronString = new RegExp(/.{1,4} .{1,4} .{1,4} .{1,4} .{1,4}/, "gi")
    if (cronString.test(value)) {
    } else if (ISOdateRegexp.test(value)) {
      const actualDate = new Date()
      const scheduledDate = new Date(value)
      if (scheduledDate < actualDate) {
        throw new Error("The date introduced should be in future")
      }
    } else {
      throw new Error(
        "The value introduced should be an cron based string or ISO8601 string"
      )
    }
    return true
  }),
  check("message", "You should set message to send").isString().escape(),
  check("id", "ID is necessary").isString().escape(),
  check("target", "Enter contact to send message").trim().escape(),
]
