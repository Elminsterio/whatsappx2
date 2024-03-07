import { config } from "./OnMailApp/Config/config"
import { Server } from "./server"

export class OnMailApp {
  server?: Server

  async start() {
    const port = config.PORT
    this.server = new Server(port)
    return this.server
  }
  get httpServer() {
    return this.server?.getHTTPServer()
  }

  async stop() {
    return this.server?.stop()
  }
}
