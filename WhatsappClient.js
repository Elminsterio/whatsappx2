const Client = require("./Client")

module.exports = class WhatsAppClient extends Client {
  constructor(url, options) {
    super(url, options)
  }

  async writeMsg(target, message) {
    const selectorSearch =
      "#side > div.uwk68 > div > div > div._16C8p > div > div._13NKt.copyable-text.selectable-text"
    const searchEl = await this.page.waitForSelector(selectorSearch, {
      timeout: 120000,
    })
    await searchEl.click()
    await searchEl.type(target)

    const selectorChatToTarget = `#pane-side > div:nth-child(1) > div > div > div:nth-child(1) > div > div`
    const chatEl = await this.page.waitForSelector(selectorChatToTarget, {
      timeout: 120000,
    })
    await chatEl.click()
    const writeEl = await this.page.waitForSelector(`[title="${target}"]`, {
      timeout: 120000,
    })
    await writeEl.click()
    await writeEl.type(message, { delay: 150 })
    await this.page.click('[data-icon="send"]', { delay: 100 })
    await this.page.waitForNetworkIdle({ idleTime: 2000 })
  }

  async getContacts(phone = "") {
    let contactsArr = await this.page.evaluate(async () => {
      return await readAllKeyValuePairs("model-storage", "contact")
    })

    if (phone) {
      contactsArr = contactsArr.filter((contact) => {
        const { id } = contact
        return id.includes(phone)
      })
    }

    console.table(contactsArr)
    return contactsArr
  }

  async getGroups(name = "") {
    const chatsArr = await this.page.evaluate(async () => {
      return await readAllKeyValuePairs("model-storage", "chat")
    })

    let groupsArr = chatsArr.filter(
      (chat) => chat.disappearingModeInitiator !== "chat"
    )

    if (name) {
      groupsArr = groupsArr.filter((group) => {
        const { name } = group
        return name.toLowerCase().includes(name.toLowerCase())
      })
    }
    console.table(groupsArr)
    return groupsArr
  }
}
