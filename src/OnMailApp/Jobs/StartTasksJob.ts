import { JobCallback } from "node-schedule"
import path from "path"
import { TaskManager } from "../../Scraper/TaskManager"
import { TasksI } from "../../Scraper/Tasks"
import { Task } from "../Domain/Entities/Task"
import TaskRepository from "../Domain/Repositories/TaskRepository"
import { UsersRepository } from "../Domain/Repositories/UsersRepository"

export class StartTasksJob {
  public taskManager: TaskManager
  public tasks: TasksI
  public taskRepository: TaskRepository
  public userRepository: UsersRepository

  constructor(
    _taskManager: TaskManager,
    _tasks: TasksI,
    _taskRepository: TaskRepository,
    _userRepository: UsersRepository
  ) {
    this.taskManager = _taskManager
    this.tasks = _tasks
    this.taskRepository = _taskRepository
    this.userRepository = _userRepository
  }

  async reAddTasks() {
    try {
      const allTasks: Task[] = await this.taskRepository.getAllTasks()
      const actualDate: Date = new Date()
      const actualYear: number = actualDate.getFullYear()
      const actualMonth: number = actualDate.getMonth()
      const actualDay: number = actualDate.getDate()
      const nextDay: number = actualDate.setDate(actualDay + 1)
      const noChargingTaskDate = new Date(
        actualYear,
        actualMonth,
        nextDay,
        0,
        0,
        0
      )
      for (let i = 0; i < allTasks.length; i++) {
        const { executionTime, taskType, userId, action, target, _id } =
          allTasks[i]
        const idString = _id.toString()

        if (
          executionTime instanceof Date &&
          executionTime.getMilliseconds() > noChargingTaskDate.getMilliseconds()
        )
          continue

        let cb: JobCallback
        switch (taskType) {
          case "WriteMessage":
            cb = this.tasks.writeTask(
              path.join(process.cwd(), "src", "assets", userId, "WH"),
              action,
              target
            )
            break
          default:
            cb = this.tasks.writeTask(
              path.join(process.cwd(), "src", "assets", userId, "WH"),
              action,
              target
            )
            break
        }
        this.taskManager.addTask(cb, executionTime, idString)
      }
    } catch (error) {
      throw error
    }
  }

  async init() {
    try {
      await this.taskManager.executeTasks()
      console.log('Tasks loaded successfully')
    } catch (error) {
      throw error
    }
  }
}
