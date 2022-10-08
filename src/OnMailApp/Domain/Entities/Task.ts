type TasksTypes = "WriteMessage" | "sendImage"
export interface Task {
  executionTime: Date | string
  taskType: TasksTypes
  action: string
  target: string
  sended?: boolean
  historic: boolean
  userId: string
  _id: string
}

export type DynamicTask = Pick<
  Task,
  "executionTime" | "userId" | "action" | "taskType" | "target"
>
