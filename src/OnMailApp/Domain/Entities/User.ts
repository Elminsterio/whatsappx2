import { Task } from "./Task"

export interface User {
  creationDate?: Date
  _id?: string
  name: string
  email: string
  password: string
  active?: boolean
  browserConfigPath?: string
  tasks?: Task[]
}
