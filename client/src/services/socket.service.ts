import io, { Socket } from 'socket.io-client'
import { SocketEmitEvents, SocketOnEvents } from "../utils/socketEvents"

const env = import.meta.env.VITE_NODE_ENV
const baseUrl = env === 'production' ? 'https://server.rolling-chat.com' : 'http://localhost:5000'

class SocketService {
      private socket: Socket | null = null

      setup(userId: string): void {
            this.socket = io(baseUrl, { reconnection: false })
            this.socket.emit(SocketEmitEvents.SETUP, userId)
      }

      on(eventName: SocketOnEvents, cb: (...args: any[]) => void): void {
            this.socket?.on(eventName, cb)
      }

      off(eventName: SocketOnEvents, cb?: (...args: any[]) => void): void {
            if (!this.socket) return
            if (!cb) {
                  this.socket.removeAllListeners(eventName)
            } else {
                  this.socket.off(eventName, cb)
            }
      }

      emit(eventName: SocketEmitEvents, data: any): void {
            this.socket?.emit(eventName, data)
      }

      terminate(): void {
            if (this.socket) {
                  this.socket.disconnect()
                  this.socket = null
            }
      }
}

const socketService = new SocketService()

export default socketService




// export const SOCKET_LOGOUT = 'logout'
// export const SOCKET_LOGIN = 'login'
// export const socketService = createSocketService()

// interface SocketService {
//       setup(userId: string): void
//       login(userId: string): void
//       logout(userId: string): void
//       on(eventName: string, cb: (...args: any[]) => void, boolParam?: boolean): void
//       off(eventName: string, cb?: (...args: any[]) => void): void
//       emit(eventName: string, data: any, callback?: CallableFunction): void
//       terminate(): void
// }

// function createSocketService(): SocketService {
//       let socket: Socket | null = null

//       const socketService: SocketService = {
//             setup(userId) {
//                   socket = io(baseUrl, { reconnection: false })
//                   socket.emit('setup', userId)
//             },
//             on(eventName, cb, boolParam = true) {
//                   if (socket) {
//                         socket.on(eventName, (...args) => {
//                               if (boolParam !== undefined) {
//                                     cb(...args, boolParam)
//                               } else {
//                                     cb(...args)
//                               }
//                         })
//                   }
//             },
//             off(eventName, cb) {
//                   if (!socket) return
//                   if (!cb) {
//                         socket.removeAllListeners(eventName)
//                   } else {
//                         socket.off(eventName, cb)
//                   }
//             },
//             login(userId) {
//                   this.emit(SOCKET_LOGIN, userId)
//             },
//             logout(userId) {
//                   this.emit(SOCKET_LOGOUT, userId)
//                   this.terminate()
//             },
//             emit(eventName, data) {
//                   if (socket) {
//                         socket.emit(eventName, data)
//                   }
//             },
//             terminate() {
//                   if (socket) {
//                         socket.disconnect()
//                         socket = null
//                   }
//             },

//       }
//       return socketService
// }

// export default socketService
