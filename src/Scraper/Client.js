const puppeteer = require("puppeteer")
const qrConverter = require("qr-image")
const path = require("path")
const { CLIENT_STATES } = require("./constants")

module.exports = class Client {
  constructor(url, options) {
    this.options = options
    this.url = url
    this.browser = null
    this.page = null
    this.isAuth = false
    this.state = CLIENT_STATES.off
  }

  async chargeEsentialFunctions() {
    let scriptPath = path.join(__dirname, "scripts", "scripts.js")
    await this.page.addScriptTag({ path: require.resolve(scriptPath) })
  }

  async initSesionOnCluster(page, url) {
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
    stringCSSSelectorAuthenticated,
    stringCSSSelectorNotAuthenticated
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

  async authenticateSession(stringCSSSelectorOfQrElement) {
    let interval
    await new Promise((resolve) => {
      interval = setInterval(async () => {
        const qr = await this.page.evaluate((selector) => {
          const qrElement = document.querySelector(selector)
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
