import { URLS } from "./constants"
import { WhatsAppClient } from "./WhatsappClient"

export interface TasksI {
  keepInitSesionTask(
    userBrowserConfPath: string,
    tries: number
  ): AsyncGenerator<string | boolean | void, boolean | undefined, unknown>
  writeTask(
    userBrowserConfPath: string,
    message: string,
    contact: string
  ): () => Promise<void>
}

export class Tasks implements TasksI {
  //TODO: retocar la función generadora tanto de el caso de uso como aquí
  async *keepInitSesionTask(userBrowserConfPath: string, tries = 10) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })

    try {
      yield await whatsapp.initSesion()
      for (let i = 0; i <= tries; i++) {
        const qrTry = await whatsapp.authenticateSession(
          '[data-testid="qrcode"]'
        )
        if(!qrTry) break
        yield qrTry
      }
      await whatsapp.checkAuthSession(".landing-main", "#side")
      if(!whatsapp.isAuth) throw new Error('hola')
      else return true
    } catch (error) {
      throw error
    } finally {
      await whatsapp.closeSesion()
    }
  }

  /* async keepInitSesionTask(userBrowserConfPath: string) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })
    await whatsapp.initSesion()
    const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
    if (!isAuth) await whatsapp.authenticateSession('[data-testid="qrcode"]')
    await whatsapp.closeSesion()
  }
  */

  writeTask(userBrowserConfPath: string, message: string, contact: string) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })
    //TODO: retocar el cliente de whatsapp para que envíe mensaje correctamente
    return async () => {
      try {
        await whatsapp.initSesion()
        const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
        if (!isAuth)
          await whatsapp.authenticateSession('[data-testid="qrcode"]')
        else await whatsapp.awakeSession()
        await whatsapp.writeMsg(contact, message)
      } catch (error) {
        throw error
      } finally {
        await whatsapp.closeSesion()
      }
    }
  }
}