import { Task } from "../../../OnMailApp/Domain/Entities/Task"

export interface TaskControllerI<T, P> {
  writeMessage: (req: T, res: P) => Promise<Task>
  registerSesion: (req: T, res: P) => AsyncGenerator<any>
  getUserTasks: (req: T, res: P) => Promise<Task[]>
  editTask: (req: T, res: P) => Promise<Task>
  deleteTask: (req: T, res: P) => void
}
