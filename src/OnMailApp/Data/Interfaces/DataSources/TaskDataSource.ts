import { Task } from "../../../Domain/Entities/Task";
import { User } from "../../../Domain/Entities/User";

export default interface TaskDataSource {
  getTasksOfUser(userId: User['_id']): Promise<Task[]> | Task[];
  getTaskById(id: Task['user']): Promise<Task> | Task;
  createTask(task: Task, userId: string): Promise<Task> | Task;
  editTask(taskId: string, task: Task): Promise<Task> | Task;
  deleteTask(taskId: string, userId: string): Promise<void>;
}