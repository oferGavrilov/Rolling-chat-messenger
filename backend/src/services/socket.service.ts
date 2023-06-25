import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { logger } from './logger.service'


let gIo: Server | null = null

export function setupSocketAPI (http: HttpServer) {
      gIo = new Server(http, {
            pingTimeout: 60000,
            cors: {
                  origin: 'http://localhost:3000',
            }
      })

      gIo.on('connection', (socket: Socket) => {
            console.log('connected to socket.io')

            logger.info(`New connected socket [id: ${socket.id}]`)

            socket.on('setup', (userId: string) => {
                  socket.join(userId)
                  socket.emit('connected')
                  console.log('socket id', socket.id, 'joined userId', userId)
                  logger.info(`Socket [id: ${socket.id}] added to userId: ${userId}`)
            })





            socket.on('disconnect', () => {
                  logger.info(`Socket [id: ${socket.id}] disconnected`)
            })

            socket.on('unset-user-socket', () => {
                  logger.info(`Socket [id: ${socket.id}] disconnected`)
                  delete socket.handshake.auth.user
            })
      })
}