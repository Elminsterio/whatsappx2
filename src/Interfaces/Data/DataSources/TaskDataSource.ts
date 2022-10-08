import { DynamicTask, Task } from "../../../Domain/Entities/Task";
import { User } from "../../../Domain/Entities/User";

export default interface TaskDataSource {
  getTasksOfUser(userId: User['_id']): Promise<Task[]> | Task[];
  getTaskById(id: Task['userId']): Promise<Task> | Task;
  createTask(task: DynamicTask, userId: string, cb: Function): Promise<Task> | Task;
  editTask(taskId: string, task: Task): Promise<Task> | Task;
  deleteTask(taskId: string, userId: string): Promise<void>;
  deleteAllTasks(userId: string): Promise<void>
}