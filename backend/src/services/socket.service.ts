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
            console.log('socket.handshake.auth', socket.id)
            logger.info(`New connected socket [id: ${socket.id}]`)

            socket.on('disconnect', () => {
                  logger.info(`Socket [id: ${socket.id}] disconnected`)
            })

            socket.on('unset-user-socket', () => {
                  logger.info(`Socket [id: ${socket.id}] disconnected`)
                  delete socket.handshake.auth.user
            })


            socket.on('chat newMsg', msg => {
                  console.log('Emitting chat addMsg', msg)
                  gIo.emit('chat addMsg', msg)
            })

            socket.on('user typing', (userName) => {
                  console.log('Emitting user typing', userName)
                  gIo.emit('user typing', userName)
            })

            socket.on('user stop typing', (userName) => {
                  console.log('Emitting user stop typing', userName)
                  gIo.emit('user stop typing', userName)
            })

            socket.on('user join', (userName) => {
                  console.log('Emitting user join', userName)
                  gIo.emit('user join', userName)
            })

            socket.on('user leave', (userName) => {
                  console.log('Emitting user leave', userName)
                  gIo.emit('user leave', userName)
            })
      })
}