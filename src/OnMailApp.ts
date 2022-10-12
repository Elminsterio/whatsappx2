import { Server } from "./server"

export class OnMailApp {
  server?: Server

  async start() {
    const port = process.env.PORT || "3000"
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
