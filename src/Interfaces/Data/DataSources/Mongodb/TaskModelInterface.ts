import { Model } from "mongoose";
import { Task } from "../../../../Domain/Entities/Task";

export interface TaskModelI {
  model: Model<Task>;
}