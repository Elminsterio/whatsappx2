import { DynamicTask, Task } from "../Entities/Task"
import { User } from "../Entities/User"

export default interface TaskRepository {
  addTaskToManager(task: Task, userDBrowserConfPath: string): void
  keepSesionTask(
    userBrowserConfPath: string,
    tries: number
  ): AsyncGenerator<any, any, unknown>
  getTasksOfUser(userId: User["_id"]): Promise<Task[]> | Task[]
  getTaskById(id: Task["userId"]): Promise<Task> | Task
  getAllTasks(): Promise<Task[]> | Task[]
  createTask(
    task: DynamicTask,
    userDBrowserConfPath: string,
    userId: User["_id"]
  ): Promise<Task> | Task
  editTask(id: string, task: DynamicTask): Promise<Task> | Task
  deleteTask(taskId: string, userId: string): void
  deleteAllTasks(userId: string): void
}
