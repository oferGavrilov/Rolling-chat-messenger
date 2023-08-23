export const SHOW_MSG = 'show-msg'

interface ListenerFunction {
      (data: any): void
}

interface ListenersMap {
      [eventName: string]: ListenerFunction[]
}

export interface IMsg {
      txt: string
      type: "success" | "warning" | "error"
}

function createEventEmitter () {
      const listenersMap: ListenersMap = {}
      return {
            on (evName: string, listener: ListenerFunction) {
                  listenersMap[evName] = listenersMap[evName]
                        ? [...listenersMap[evName], listener]
                        : [listener]
                  return () => {
                        listenersMap[evName] = listenersMap[evName].filter(
                              func => func !== listener
                        )
                  }
            },
            emit (evName: string, data: any) {
                  if (!listenersMap[evName]) return
                  listenersMap[evName].forEach(listener => listener(data))
            }
      }
}

export const eventBus = createEventEmitter()

export function showUserMsg (msg: IMsg) {
      eventBus.emit(SHOW_MSG, msg)
}

export function showSuccessMsg (txt: string) {
      showUserMsg({ txt, type: 'success' })
}

export function showWarningMsg (txt: string) {
      showUserMsg({ txt, type: 'warning' })
}

export function showErrorMsg (txt: string) {
      showUserMsg({ txt, type: 'error' })
}

// Debugging 
declare global {
      interface Window {
            showUserMsg: typeof showUserMsg
      }
}

window.showUserMsg = showUserMsg
