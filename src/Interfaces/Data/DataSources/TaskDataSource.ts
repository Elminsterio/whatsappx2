import { DynamicTask, Task } from "../../../OnMailApp/Domain/Entities/Task"
import { User } from "../../../OnMailApp/Domain/Entities/User"

export default interface TaskDataSource {
  getTasksOfUser(userId: User["_id"]): Promise<Task[]> | Task[]
  getTaskById(id: Task["userId"]): Promise<Task> | Task
  getAllTasks(): Promise<Task[]> | Task[]
  createTask(
    task: DynamicTask,
    userId: string,
    userBrowserConfPath: string
  ): Promise<Task> | Task
  editTask(taskId: string, task: DynamicTask): Promise<Task> | Task
  deleteTask(taskId: string, userId: string): Promise<Task>
  deleteAllTasks(userId: string): Promise<void>
  WHInitSesion(userBrowserConfPath: string, tries: number): AsyncGenerator
  isWHSesionInitiated(userBrowserConfPath: string): boolean
}
