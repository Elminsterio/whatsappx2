import { Task } from "../../../Domain/Entities/Task"

export interface TaskControllerI<T, P> {
  writeMessage: (req: T, res: P) => Promise<Task>
  registerSesion: (req: T, res: P) => AsyncGenerator<any>
  getUserTasks: (req: T, res: P) => Promise<Task[]>
}