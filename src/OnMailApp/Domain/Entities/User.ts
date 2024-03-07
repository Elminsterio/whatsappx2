import { Task } from "./Task"

export interface User {
  creationDate: Date
  _id: string
  name: string
  email: string
  password: string
  active: boolean
  isAuth: boolean
  browserConfigPath?: string
  tasks?: string[]
}

export type DynamicUser = Partial<
  Pick<User, "password" | "name" | "email" | "isAuth">
>

export type LoginUser = Pick<User, "password" | "email">
