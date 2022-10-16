import { OnMailApp } from "./OnMailApp"


async function init() {
  let app: any;
  try {
    app = await new OnMailApp().start()
    await app.listen()
    await app.startJobs()
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
