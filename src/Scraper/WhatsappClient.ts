import { Client } from "./Client"

export class WhatsAppClient extends Client {
  constructor(url: string, options: object) {
    super(url, options)
  }

  async writeMsg(phone: string, target: string, message: string) {
    const selectorSearch =
      'div[role="textbox"]'
    const searchEl = await this.page.waitForSelector(selectorSearch, {
      timeout: 120000,
    })
    await searchEl.click()
    await searchEl.type(phone)

    const selectorChatToTarget = `[title="${target}"]`
    const chatEl = await this.page.waitForSelector(selectorChatToTarget, {
      timeout: 120000,
    })
    if (!chatEl) throw new Error("The target was not found")
    await chatEl.click()
    const writeEl = await this.page.waitForSelector(
      `footer div[role="textbox"]`,
      {
        timeout: 120000,
      }
    )
    await writeEl.click()
    await writeEl.type(message, { delay: 150 })
    await this.page.click('[data-icon="send"]', { delay: 100 })
    await this.page.waitForNetworkIdle({ idleTime: 2000 })
  }

  async getContacts(phone: string = "") {
    let contactsArr = await this.page.evaluate(async () => {
      return await readAllKeyValuePairs("model-storage", "contact")
    })
    if (phone) {
      contactsArr = contactsArr.filter((contact: any) => {
        const { id } = contact
        return id.includes(phone)
      })
    }
    return contactsArr
  }

  async getGroups(name = "") {
    const chatsArr = await this.page.evaluate(async () => {
      return await readAllKeyValuePairs("model-storage", "chat")
    })

    let groupsArr = chatsArr.filter(
      (chat: any) => chat.disappearingModeInitiator !== "chat"
    )

    if (name) {
      groupsArr = groupsArr.filter((group: any) => {
        const { name } = group
        return name.toLowerCase().includes(name.toLowerCase())
      })
    }
    return groupsArr
  }
}

function readAllKeyValuePairs(arg0: string, arg1: string) {
  throw new Error("Function not implemented.")
}
