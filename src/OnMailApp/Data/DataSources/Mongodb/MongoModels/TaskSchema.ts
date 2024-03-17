import { model, Model, Schema } from "mongoose"
import { Task } from "../../../../Domain/Entities/Task"
import { TaskModelI } from "../../../../../Interfaces/Data/DataSources/Mongodb/TaskModelInterface"

export class TaskModel implements TaskModelI {
  private TaskSchema: Schema
  public model: Model<Task>

  constructor() {
    this.TaskSchema = new Schema<Task>({
      executionTime: { type: Schema.Types.Mixed, required: true },
      taskType: { type: String, required: true },
      action: { type: Schema.Types.Mixed },
      targetPhone: { type: String },
      destinatary: { type: String },
      sended: { type: Boolean },
      historic: { type: Boolean, default: false },
      userId: { type: String, required: true },
      stopped: { type: Boolean, default: false },
    })

    this.model = model<Task>("Task", this.TaskSchema)
  }
}
