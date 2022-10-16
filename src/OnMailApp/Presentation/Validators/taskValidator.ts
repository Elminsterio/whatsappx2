import { check } from "express-validator"

export const createWriteTaskValidator = [
  check("time")
    .custom((value) => {
      '2022-10-16T15:12:02Z'
      const ISOdateRegexp = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/, 'gi')
      const cronString = new RegExp(/.{1,4} .{1,4} .{1,4} .{1,4} .{1,4}/, 'gi' )
      if(cronString.test(value)) {
        return value
      } else if(ISOdateRegexp.test(value)) {
        return new Date(value)
      } else {
        throw new Error('The value introduced should be an cron based string or ISO8601 string')
      }
    })
    .trim()
    .escape(),
  check("message", "You should set message to send").isString().escape(),
  check("id", "ID is necessary").isNumeric().escape(),
  check("target", "Enter contact to send message").trim().escape(),
]
