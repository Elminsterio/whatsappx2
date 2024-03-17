type TasksTypes = "WriteMessage" | "sendImage"
export interface Task {
  executionTime: string
  taskType: TasksTypes
  action: string
  targetPhone: string
  destinatary: string
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
    | "targetPhone"
    | "destinatary"
    | "stopped"
    | "historic"
  >
>
