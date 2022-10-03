import puppeteer from "puppeteer"
import qrConverter from "qr-image"
import path from "path"
import { CLIENT_STATES } from "./constants"

export class Client {
  options: object
  url: string
  browser: any
  page: any
  isAuth: boolean
  state: string

  constructor(url: string, options: object) {
    this.options = options
    this.url = url
    this.browser = null
    this.page = null
    this.isAuth = false
    this.state = CLIENT_STATES.off
  }

  async chargeEsentialFunctions() {
    let scriptPath = path.join(__dirname, "scripts", "scripts.ts")
    await this.page.addScriptTag({ path: require.resolve(scriptPath) })
  }

  async initSesionOnCluster(page: puppeteer.Page, url: string) {
    this.page = page
    this.url = url
    await this.page.goto(this.url, {
      waitUntil: "load",
    })
    this.state = CLIENT_STATES.starting
  }

  async initSesion() {
    this.browser = await puppeteer.launch(this.options)
    this.page = await this.browser.newPage()
    await this.page.goto(this.url, {
      waitUntil: "load",
    })
    this.state = CLIENT_STATES.starting
  }

  async checkAuthSession(
    stringCSSSelectorAuthenticated: string,
    stringCSSSelectorNotAuthenticated: string
  ) {
    const isAuth = await Promise.race([
      this.page
        .waitForSelector(stringCSSSelectorAuthenticated, {
          timeout: 120000,
        })
        .then(() => false),
      this.page
        .waitForSelector(stringCSSSelectorNotAuthenticated, {
          timeout: 120000,
        })
        .then(() => true),
    ])
    this.isAuth = isAuth
    return this.isAuth
  }

  async authenticateSession(stringCSSSelectorOfQrElement: string) {
    let interval: string | number | NodeJS.Timer | undefined;
    await new Promise<void>((resolve) => {
      interval = setInterval(async () => {
        const qr = await this.page.evaluate((selector: string) => {
          const qrElement: any = document.querySelector(selector)
          if (!qrElement) return
          return qrElement.dataset.ref
        }, stringCSSSelectorOfQrElement)

        if (!qr) {
          clearInterval(interval)
          resolve()
          return
        }
        let qrImg = qrConverter.image(qr, { type: "png" })
        qrImg.pipe(require("fs").createWriteStream("i_love_qr.png"))
        return qr
      }, 10000)
    })
    await this.awakeSession()
  }

  async awakeSession() {
    await this.chargeEsentialFunctions()
    await this.page.waitForSelector("#side", { timeout: 120000 })
    this.state = CLIENT_STATES.ready
  }

  async closeSesion() {
    this.browser.close()
    this.state = CLIENT_STATES.off
  }
}
