import { URLS } from "./constants"
import { WhatsAppClient } from "./WhatsappClient"

export function writeTask(userBrowserConfPath: string) {
  const whatsapp = new WhatsAppClient(URLS.whatsApp, {
    headless: true,
    userDataDir: userBrowserConfPath,
  })

  return async () => {
    await whatsapp.initSesion()
    const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
    if (!isAuth) await whatsapp.authenticateSession('[data-testid="qrcode"]')
    else await whatsapp.awakeSession()
    await whatsapp.writeMsg("Fami Rosi 🏡", "Buenos días chicos!")
    await whatsapp.closeSesion()
  }
}

