import { Task } from "../../../Domain/Entities/Task";

export interface TaskControllerI<T, P> {
  writeMessage: (req: T, res: P) => Promise<Task>
}