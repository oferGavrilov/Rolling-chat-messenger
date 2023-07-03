import { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { logger } from './logger.service'
import { User } from '../../models/user.model'
import { userInfo } from 'os'
import { ChatDocument } from '../../models/chat.model'


let gIo: Server | null = null

export function setupSocketAPI (http: HttpServer) {
      gIo = new Server(http, {
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
                  logger.info(`Socket [id: ${socket.id}] added to userId: ${userId}`)
            })

            // user is online
            // socket.on('user online', (userId: string) => {
            //       socket.broadcast.emit('user online', userId)
            // })

            // on create group with users and return the new group chat
            socket.on('create group', (users: User[], adminId: string, group: ChatDocument) => {
                  users.forEach((user: User) => {
                        if (user._id !== adminId) {
                              socket.to(user._id).emit('new group', group);
                        }
                  })
            })



            socket.on('join chat', (room) => {
                  socket.join(room)
                  logger.info(`Socket [id: ${socket.id}] joined room: ${room}`)
            })

            socket.on('typing', (room, userId) => socket.in(room).emit('typing', userId))

            socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

            socket.on('new message', (newMessageReceived) => {
                  let chat = newMessageReceived.chat
                  if (!chat.users) return logger.info(`Socket [id: ${socket.id}] tried to send a message to a chat without users`)

                  chat.users.forEach((user: User) => {
                        console.log(user._id, newMessageReceived.sender._id)
                        if (user._id === newMessageReceived.sender._id) return
                        console.log('after If')
                        socket.in(user._id).emit('message received', newMessageReceived)
                  })
            })

            socket.off('setup', () => {
                  socket.leave(socket.id)
            })
      })
}