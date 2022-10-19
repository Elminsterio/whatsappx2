type TasksTypes = "WriteMessage" | "sendImage"
export interface Task {
  executionTime: string
  taskType: TasksTypes
  action: string
  target: string
  sended?: boolean
  historic: boolean
  stopped: boolean
  userId: string
  _id: string
}

export type DynamicTask = Partial<
  Pick<
    Task,
    | "executionTime"
    | "userId"
    | "action"
    | "taskType"
    | "target"
    | "stopped"
    | "historic"
  >
>
