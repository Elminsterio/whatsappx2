import { DynamicTask, Task } from "../Entities/Task"
import { User } from "../Entities/User"

export default interface TaskRepository {
  WHInitSesion(userBrowserConfPath: string, tries: number): AsyncGenerator
  isWHSesionInitiated(userBrowserConfPath: string): boolean
  getTasksOfUser(userId: User["_id"]): Promise<Task[]> | Task[]
  getTaskById(id: Task["userId"]): Promise<Task> | Task
  getAllTasks(): Promise<Task[]> | Task[]
  createTask(
    task: DynamicTask,
    userDBrowserConfPath: string,
    userId: User["_id"]
  ): Promise<Task> | Task
  editTask(id: string, task: DynamicTask): Promise<Task> | Task
  deleteTask(taskId: string, userId: string): Promise<Task>
  deleteAllTasks(userId: string): void
}
