import { Task } from "../../../Domain/Entities/Task"

export interface TaskControllerI<T, P> {
  writeMessage: (req: T, res: P) => Promise<Task>
  registerSesion: (req: T, res: P) => Promise<void>
  getUserTasks: (req: T, res: P) => Promise<Task[]>
}
