
class TelegramClient {
  constructor() {
    this.browser = null
    this.page = null
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      userDataDir: "./teleg/hola",
    })
    this.page = await this.browser.newPage()
    await this.page.goto("https://web.telegram.org/k/", {
      waitUntil: "networkidle2",
    })
    let interval
    await new Promise((resolve) => {
      interval = setInterval(async () => {
        const qr = await this.page.$(".landing-main")
        if (!qr) {
          clearInterval(interval)
          resolve()
          return
        }
        await qr.screenshot({ path: "example.png" })
        console.log(qr)
      }, 15000)
    })
    await this.page.waitForSelector("#page-chats", { timeout: 120000 })
  }

  async init2() {
    this.browser = await puppeteer.launch({
      headless: false,
      userDataDir: "./teleg/hola",
    })
    this.page = await this.browser.newPage()
    await this.page.goto("https://web.telegram.org/k/", {
      waitUntil: "networkidle2",
    })
  }

  async close() {
    await this.browser.close()
  }
}