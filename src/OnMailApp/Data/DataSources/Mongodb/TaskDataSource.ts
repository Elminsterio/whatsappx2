import schedule from "node-schedule"
import { User } from "../../../Domain/Entities/User"
import TaskDataSource from "../../../../Interfaces/Data/DataSources/TaskDataSource"
import { DynamicTask, Task } from "../../../Domain/Entities/Task"
import { ErrorBDEntityNotFound } from "../../../Domain/Entities/Errors"
import { UserModelI } from "../../../../Interfaces/Data/DataSources/Mongodb/UserModelInterface"
import { TaskModelI } from "../../../../Interfaces/Data/DataSources/Mongodb/TaskModelInterface"

export default class TaskDataSourceImpl implements TaskDataSource {
  public taskModel: any
  public userModel: any

  constructor(_taskModel: TaskModelI, _userModel: UserModelI) {
    this.taskModel = _taskModel.model
    this.userModel = _userModel.model
  }

  async getTasksOfUser(userId: User["_id"]): Promise<Task[]> {
    return await this.taskModel.find({ user: userId })
  }

  async getTaskById(id: string): Promise<Task> {
    const tasksOnDB = await this.taskModel.findById({ _id: id })
    if (!tasksOnDB) throw new ErrorBDEntityNotFound("This task doesn't exist")
    return tasksOnDB
  }

  async getAllTasks(): Promise<Task[]> {
    const tasksOnDB = await this.taskModel.find()
    return tasksOnDB
  }

  async createTask(
    task: DynamicTask,
    userId: string,
    cb: Function
  ): Promise<Task> {
    const userOnDB: any = await this.userModel.findById({ _id: userId })
    if (!userOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any user"
      )
    const newTask = new this.taskModel(task)

    if (!userOnDB.tasks) userOnDB.tasks = []
    userOnDB.tasks.push(newTask._id)

    const [, taskSaved] = await Promise.all([userOnDB.save(), newTask.save()])
    schedule.scheduleJob(
      userId,
      taskSaved.executionTime,
      cb as schedule.JobCallback
    )
    return await taskSaved
  }

  // TODO: create correct edit task
  async editTask(taskId: string): Promise<Task> {
    const isTaskOnDB = await this.taskModel.findByIdAndUpdate(
      taskId,
      { taskType: "WriteMessage" },
      { new: true, runValidators: true }
    )
    if (!isTaskOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any task"
      )
    return isTaskOnDB
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const userOnDB = await this.userModel.findById(userId)
    if (!userOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any user"
      )

    const indexOfTask = userOnDB.tasks.indexOf(taskId)
    if (indexOfTask > -1) userOnDB.tasks.splice(indexOfTask, 1)
    else
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any task or it isn't assigned to this user"
      )

    const taskOnDB = await this.taskModel.findById(taskId)
    if (!taskOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any task"
      )
    const jobNames = schedule.scheduledJobs
    if (jobNames[taskId]) jobNames[taskId].cancel()
    await Promise.all([userOnDB.save(), taskOnDB.remove()])
    return
  }

  async deleteAllTasks(userId: string) {
    const userOnDB = await this.userModel.findById(userId)
    if (!userOnDB)
      throw new ErrorBDEntityNotFound(
        "The id provided doesn't match with any user"
      )
    const jobNames = schedule.scheduledJobs
    if (userOnDB.tasks?.length) {
      for (let i = 0; i < userOnDB.tasks.length; i++) {
        const taskId = userOnDB.tasks[i].toString()
        const task = await this.taskModel.findById(taskId)
        if (jobNames[taskId]) jobNames[taskId].cancel()
        task.remove()
      }
    }
    return
  }
}
