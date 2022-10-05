export interface Task {
  executionTime: Date | string
  taskType: TasksTypes
  action?: string
  target?: string
  sended?: boolean
  historic?: boolean
  user: string
  _id?: string
}

type TasksTypes = "WriteMessage" | "sendImage"
