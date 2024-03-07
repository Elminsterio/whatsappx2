export interface TaskManagerI {
  tasks: Function[]
  addTask(cb: () => Promise<void>): void
  executeTasks(): void
}

export class TaskManager implements TaskManagerI {
  tasks: Function[] = []
  executing: boolean = false

  addTask(cb: () => Promise<void>) {
    this.tasks.unshift(cb)
  }

  async executeTasks() {
    if (!this.executing) {
      this.executing = true
    } else {
      setTimeout(() => {
        this.executeTasks()
      }, 2000)
      return
    }

    try {
      for (let i = this.tasks.length - 1; 0 <= i; i--) {
        await this.tasks[i]()
        this.tasks.pop()
      }
      this.executing = false
    } catch (error) {
      throw error
    }
  }
}
