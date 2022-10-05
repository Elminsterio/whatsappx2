import { Task } from "../Entities/Task"
import { User } from "../Entities/User"

export default interface TaskRepository {
  addTaskToManager(task: Task, userDBrowserConfPath: string): void
  executeTask(task: Task, userDBrowserConfPath: string): void
  keepSesionTask(userBrowserConfPath: string): Promise<void> | void
  getTasksOfUser(userId: User["_id"]): Promise<Task[]> | Task[]
  getTaskById(id: Task["user"]): Promise<Task> | Task
  createTask(task: Task, userId: User["_id"]): Promise<Task> | Task
  editTask(id: string, task: Task): Promise<Task> | Task
  deleteTask(taskId: string, userId: string): void
}
