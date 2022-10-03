import { Client } from "./Client"

export class WhatsAppClient extends Client {
  constructor(url: string, options: object) {
    super(url, options)
  }

  async writeMsg(target: string, message: string) {
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

    console.table(contactsArr)
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
    console.table(groupsArr)
    return groupsArr
  }
}
function readAllKeyValuePairs(arg0: string, arg1: string) {
  throw new Error("Function not implemented.")
}
