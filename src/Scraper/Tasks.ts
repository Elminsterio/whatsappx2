import { URLS } from "./constants"
import { WhatsAppClient } from "./WhatsappClient"

export interface TasksI {
  sesions: { [userBrowserConfPath: string]: WhatsAppClient }
  keepInitSesionTaskNoConcurrency(
    userBrowserConfPath: string,
    tries: number
  ): AsyncGenerator<string | boolean | void, boolean | undefined, unknown>
  getAllContactsTask(userBrowserConfPath: string): Promise<any>
  writeTask(
    userBrowserConfPath: string,
    sendObj: any,
    onErrorHandler: (error: any) => void,
    onSuccessHandler: (arg?: any) => void
  ): () => Promise<void>
  closeSesion(userBrowserConfPath: string): Promise<void>
}

export class Tasks implements TasksI {
  sesions: { [userBrowserConfPath: string]: WhatsAppClient } = {}
  //TODO: retocar la función generadora tanto de el caso de uso como aquí
  async *keepInitSesionTaskNoConcurrency(
    userBrowserConfPath: string,
    tries = 10
  ) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })

    if (!this.sesions[userBrowserConfPath]) {
      this.sesions[userBrowserConfPath] = whatsapp
    } else {
      throw new Error("The user is validating now, please try later")
    }

    try {
      yield await whatsapp.initSesion()
      await whatsapp.checkAuthSession(".landing-main", "#side")
      for (let i = 0; i <= tries; i++) {
        const qrTry = await whatsapp.authenticateSession(
          'div[data-ref]'
        )
        if (!qrTry) break
        yield qrTry
        if (i === tries) throw new Error("Maximum tries, please try again")
      }
      await whatsapp.checkAuthSession(".landing-main", "#side")
      if (!whatsapp.isAuth) {
        throw new Error("Not Authenticated")
      } else {
        return true
      }
    } catch (error) {
      throw error
    } finally {
      Reflect.deleteProperty(this.sesions, userBrowserConfPath)
      await whatsapp.closeSesion()
    }
  }

  async getAllContactsTask(userBrowserConfPath: string) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: true,
      userDataDir: userBrowserConfPath,
    })

    if (!this.sesions[userBrowserConfPath]) {
      this.sesions[userBrowserConfPath] = whatsapp
    }

    try {
      await whatsapp.initSesion()
      const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
      if (!isAuth) {
        throw new Error("Not authenticated")
      } else {
        await whatsapp.awakeSession()
      }
      return await whatsapp.getContacts()
    } catch (error: any) {
      throw error
    } finally {
      Reflect.deleteProperty(this.sesions, userBrowserConfPath)
      await whatsapp.closeSesion()
    }
  }

  writeTask(
    userBrowserConfPath: string,
    sendObj: any,
    onErrorHandler: (error: unknown) => void,
    onSuccessHandler: (arg?: any) => void,
    args?: any[]
  ) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: false,
      userDataDir: userBrowserConfPath,
    })

    if (!this.sesions[userBrowserConfPath]) {
      this.sesions[userBrowserConfPath] = whatsapp
    }
    const {action, destinatary, targetPhone} = sendObj;
    //TODO: retocar el cliente de whatsapp para que envíe mensaje correctamente
    return async () => {
      try {
        await whatsapp.initSesion()
        const isAuth = await whatsapp.checkAuthSession(".landing-main", "#side")
        if (!isAuth) {
          throw new Error("Not authenticated")
        } else {
          await whatsapp.awakeSession()
        }
        await whatsapp.writeMsg(targetPhone, destinatary, action)
        if (args) onSuccessHandler(...args)
        else onSuccessHandler()
      } catch (error: any) {
        onErrorHandler(error)
      } finally {
        Reflect.deleteProperty(this.sesions, userBrowserConfPath)
        await whatsapp.closeSesion()
      }
    }
  }

  async closeSesion(userBrowserConfPath: string) {
    const sesionClosed = this.sesions[userBrowserConfPath].closeSesion()
    Reflect.deleteProperty(this.sesions, userBrowserConfPath)
    return await sesionClosed
  }
}
