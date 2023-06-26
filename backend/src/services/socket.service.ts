import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { logger } from './logger.service'
import { User } from '../../models/user.model'


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

            socket.on('join chat', (room) => {
                  socket.join(room)
                  console.log('user joined room', room)
                  logger.info(`Socket [id: ${socket.id}] joined room: ${room}`)
            })

            socket.on('typing', (room) => socket.in(room).emit('typing'))
            
            socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

            socket.on('new message', (newMessageReceived) => {
                  let chat = newMessageReceived.chat
                  if (!chat.users) return logger.info(`Socket [id: ${socket.id}] tried to send a message to a chat without users`)

                  chat.users.forEach((user: User) => {
                        if (user._id === newMessageReceived.sender._id) return

                        socket.in(user._id).emit('message received', newMessageReceived)
                  })
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