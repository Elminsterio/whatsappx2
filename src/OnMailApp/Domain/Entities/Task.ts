export interface Task {
  executionTime: Date | string
  taskType: TasksTypes
  user: string
  _id?: string
}

type TasksTypes = "WriteMessage" | "sendImage"
