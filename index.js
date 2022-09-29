const TaskManager = require("./TaskManager")
const { writeTask } = require("./Tasks")

async function generate() {
  const taskManager = new TaskManager()
  const newWriteTask = writeTask("./what/dwa")
  taskManager.addTask(newWriteTask)
  await taskManager.executeTasks()
}

generate()
