import { Model } from "mongoose";
import { Task } from "../../../../OnMailApp/Domain/Entities/Task";

export interface TaskModelI {
  model: Model<Task>;
}