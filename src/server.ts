import { repositories, taskManager, tasks } from "./OnMailApp/instances"
import { StartTasksJob } from "./OnMailApp/Jobs/StartTasksJob"
import { json, urlencoded } from "body-parser"
import cors from "cors"
import mongoose from "mongoose"
import express, { Express, ErrorRequestHandler } from "express"
import * as http from "http"
import { RoutesRegister } from "./OnMailApp/Presentation/Routes/routesRegister"
import { ErrorHandler } from "./OnMailApp/Presentation/ErrorHandlers/ErrorHandler"

export class Server {
  private express: Express
  private port: string
  private httpServer?: http.Server

  constructor(port: string) {
    this.port = port
    this.express = express()
    this.express.use(
      cors({
        origin: "*",
      })
    )
    this.express.use(json())
    this.express.use(urlencoded({ extended: true }))
    new RoutesRegister(this.express).registerAllRoutes()
    this.express.use(ErrorHandler.manageError as ErrorRequestHandler)
  }

  async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.httpServer = this.express.listen(this.port, () => {
        console.log(
          `  Backend App is running at http://localhost:${
            this.port
          } in ${this.express.get("env")} mode`
        )
        console.log("  Press CTRL-C to stop\n")
        resolve()
      })
      mongoose.connect("mongodb://localhost:27017/OnMailTest")
    })
  }

  async startJobs() {
    const tasksJob = new StartTasksJob(
      taskManager,
      tasks,
      repositories.taskRepo,
      repositories.userRepo
    )
    await tasksJob.reAddTasks()
    await tasksJob.init()
  }

  getHTTPServer() {
    return this.httpServer
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => {
          if (error) {
            return reject(error)
          }
          return resolve()
        })
      }
      return resolve()
    })
  }
}
