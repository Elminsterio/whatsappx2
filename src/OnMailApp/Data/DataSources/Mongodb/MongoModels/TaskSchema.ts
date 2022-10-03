import mongoose, { model, Model, Schema } from "mongoose"
import { Task } from "../../../../Domain/Entities/Task"
import { TaskModelI } from "../../../Interfaces/DataSources/Mongodb/TaskModelInterface"
import mongooseFunction from 'mongoose-function'
mongooseFunction(mongoose)

export class TaskModel implements TaskModelI {
  private TaskSchema: Schema
  public model: Model<Task>

  constructor() {
    this.TaskSchema = new Schema<Task>({
      executionTime: { type: Schema.Types.Mixed, required: true },
      taskType: { type: String, required: true },
      taskFunction: { type: Function, required: true },
      user: { type: String, required: true },
    })

    this.model = model<Task>("Task", this.TaskSchema)
  }
}
