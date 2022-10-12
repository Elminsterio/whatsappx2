import { OnMailApp } from "./OnMailApp"


async function init() {
  try {
    const APP = await new OnMailApp().start()
    await APP.listen()
    await APP.startJobs()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

init()

process.on("uncaughtException", (err) => {
  console.log("uncaughtException", err)
  process.exit(1)
})
