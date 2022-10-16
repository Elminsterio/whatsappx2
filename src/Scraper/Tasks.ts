import { URLS } from "./constants"
import { WhatsAppClient } from "./WhatsappClient"

export interface TasksI {
  sesions: { [userBrowserConfPath: string]: string }
  keepInitSesionTaskNoConcurrency(
    userBrowserConfPath: string,
    tries: number
  ): AsyncGenerator<string | boolean | void, boolean | undefined, unknown>
  writeTask(
    userBrowserConfPath: string,
    message: string,
    contact: string,
    onErrorHandler: (error: any) => void,
    onSuccessHandler: (arg?: any) => void
  ): () => Promise<void>
}

export class Tasks implements TasksI {
  sesions: { [userBrowserConfPath: string]: string } = {}
  //TODO: retocar la función generadora tanto de el caso de uso como aquí
  async *keepInitSesionTaskNoConcurrency(
    userBrowserConfPath: string,
    tries = 10
  ) {

    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: true,
      userDataDir: userBrowserConfPath,
    })

    try {
      if (!this.sesions[userBrowserConfPath]) {
        this.sesions[userBrowserConfPath] = userBrowserConfPath
      } else {
        throw new Error("The user is validating now, please try later")
      }
      yield await whatsapp.initSesion()
      await whatsapp.checkAuthSession(".landing-main", "#side")
      for (let i = 0; i <= tries; i++) {
        const qrTry = await whatsapp.authenticateSession(
          '[data-testid="qrcode"]'
        )
        if (!qrTry) break
        yield qrTry
        console.log(i, tries)
        if (i === tries) throw new Error("Maximum tries, please try again")
      }
      await whatsapp.checkAuthSession(".landing-main", "#side")
      if (!whatsapp.isAuth) {
        throw new Error("Not Authenticated")
      } else {
        Reflect.deleteProperty(this.sesions, userBrowserConfPath)
        return true
      }
    } catch (error) {
      Reflect.deleteProperty(this.sesions, userBrowserConfPath)
      throw error
    } finally {
      await whatsapp.closeSesion()
    }
  }

  writeTask(
    userBrowserConfPath: string,
    message: string,
    contact: string,
    onErrorHandler: (error: unknown) => void,
    onSuccessHandler: (arg?: any) => void,
    args?: any[]
  ) {
    const whatsapp = new WhatsAppClient(URLS.whatsApp, {
      headless: true,
      userDataDir: userBrowserConfPath,
    })
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
        await whatsapp.writeMsg(contact, message)
        if (args) onSuccessHandler(...args)
        else onSuccessHandler()
      } catch (error: any) {
        onErrorHandler(error)
      } finally {
        await whatsapp.closeSesion()
      }
    }
  }
}
