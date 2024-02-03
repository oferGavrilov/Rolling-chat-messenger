import io, { Socket } from 'socket.io-client'

export const SOCKET_LOGOUT = 'logout'
export const SOCKET_LOGIN = 'login'

const env = import.meta.env.VITE_NODE_ENV
const baseUrl = env === 'production' ? 'https://rolling-backend.onrender.com' : 'http://localhost:5000'

// const baseUrl =
//       process.env.NODE_ENV === 'production'
//             ? process.env.VITE_API_URL as string
//             : 'http://localhost:5000'

export const socketService = createSocketService()

interface SocketService {
      setup(userId: string): void
      login(userId: string): void
      logout(userId: string): void
      on(eventName: string, cb: (...args: any[]) => void, boolParam?: boolean): void
      off(eventName: string, cb?: (...args: any[]) => void): void
      emit(eventName: string, data: any, callback?: CallableFunction): void
      terminate(): void
}

function createSocketService(): SocketService {
      let socket: Socket | null = null

      const socketService: SocketService = {
            setup(userId) {
                  socket = io(baseUrl, { reconnection: false })
                  socket.emit('setup', userId)
            },
            on(eventName, cb, boolParam = true) {
                  if (socket) {
                        socket.on(eventName, (...args) => {
                              if (boolParam !== undefined) {
                                    cb(...args, boolParam)
                              } else {
                                    cb(...args)
                              }
                        })
                  }
            },
            off(eventName, cb) {
                  if (!socket) return
                  if (!cb) {
                        socket.removeAllListeners(eventName)
                  } else {
                        socket.off(eventName, cb)
                  }
            },
            login(userId) {
                  this.emit(SOCKET_LOGIN, userId)
            },
            logout(userId) {
                  this.emit(SOCKET_LOGOUT, userId)
                  this.terminate()
            },
            emit(eventName, data, callback) {
                  if (socket) {
                        socket.emit(eventName, data, (response) => {
                              // console.log(response)
                              // if (callback) callback(response)
                        })
                  }
            },
            terminate() {
                  if (socket) {
                        socket.disconnect()
                        socket = null
                  }
            },

      }
      return socketService
}

export default socketService
