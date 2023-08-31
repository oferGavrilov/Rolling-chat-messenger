import type { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
// import { logger } from './logger.service.js'
import type { User } from '../models/user.model.js'
import { Chat, type ChatDocument } from '../models/chat.model.js'
import { updateUserStatus } from '../api/user/service.js'

let gIo: Server | null = null
const activeUsers: Map<string, Socket> = new Map()
const INACTIVITY_THRESHOLD = 15 * 60 * 1000 // 15 minute 

export function setupSocketAPI (http: HttpServer) {
      gIo = new Server(http, {
            cors: {
                  origin: '*',
            }
      })

      gIo.on('connection', (socket: Socket) => {
            console.log('connected to socket.io')
            console.log('Users connected:', activeUsers.size)

            socket.on('setup', (userId: string) => {
                  activeUsers.set(userId, socket)
                  socket.join(userId)
                  socket.broadcast.emit('connected', userId)
            })

            socket.on('login', (userId: string) => {
                  activeUsers.set(userId, socket)
                  socket.join(userId)
                  socket.broadcast.emit('login', userId)
                  console.log(`Users connected: ${activeUsers.size}`)
            })

            socket.on('logout', (userId: string) => {
                  if (userId) {
                        console.log('User disconnected:', userId)
                        activeUsers.delete(userId)
                        socket.disconnect(true)
                        updateUserStatus(userId, false)
                        socket.broadcast.emit('logout', userId)
                  }
            })

            socket.on('create group', (users: User[], adminId: string, group: ChatDocument) => {
                  users.forEach((user: User) => {
                        if (user._id !== adminId) {
                              socket.to(user._id).emit('new group', group)
                        }
                  })
            })

            socket.on('join chat', ({ chatId: room, userId }) => {
                  socket.handshake.auth.lastActivity = Date.now()
                  socket.join(room)
                  console.log(`Socket [id: ${socket.id}] joined room: ${room}`)
                  updateUserActivity(userId)
            })

            socket.on('leave chat', ({ chatId: room, userId }) => {
                  socket.handshake.auth.lastActivity = Date.now()
                  socket.leave(room)
                  console.log(`Socket [id: ${socket.id}] left room: ${room}`)
                  updateUserActivity(userId)
            })

            socket.on('typing', ({ chatId: room, userId }) => {
                  socket.in(room).emit('typing', room, userId)
                  updateUserActivity(userId)
            })

            socket.on('stop typing', ({ chatId: room, userId }) => {
                  socket.in(room).emit('stop typing')
                  updateUserActivity(userId)
            })

            socket.on('new message', (newMessageReceived) => {
                  console.log('new message received', newMessageReceived)
                  socket.handshake.auth.lastActivity = Date.now()
                  let chat = newMessageReceived.chat
                  if (!chat) return console.log(`Socket [id: ${socket.id}] tried to send a message without a chat`)
                  if (!chat?.users) return console.log(`Socket [id: ${socket.id}] tried to send a message to a chat without users`)

                  chat?.users.forEach((user: User) => {
                        if (user._id === newMessageReceived.sender._id) return
                        socket.in(user._id).emit('message received', newMessageReceived)
                        console.log(`Socket [id: ${socket.id}] sent a message to userId: ${user._id}`)
                  })
            })

            socket.on('kick-from-group', async ({ chatId, userId, kickerId }) => {
                  console.log(`user: ${kickerId} kicked user: ${userId} from chat: ${chatId}`)

                  socket.in(userId).emit('user-kicked', { chatId, userId, kickerId })
            })

            socket.on('add-to-group', async ({ chatId, users, adderId }: { chatId: string, users: User[], adderId: string }) => {
                  console.log(`user: ${adderId} added users: ${users.map(user => user._id)} to chat: ${chatId}`)

                  users.forEach((user: User) => {
                        socket.in(user._id).emit('user-joined', { chatId, user, adderId })
                  })
            })

            socket.on('leave-from-group', async ({ chatId, userId, chatUsers }) => {
                  console.log(`user: ${userId} left chat: ${chatId}`)

                  chatUsers.forEach((user: User) => {
                        if (user._id !== userId) {
                              socket.in(user._id).emit('user-left', { chatId, userId })
                        }
                  })
            })

            socket.on('message-removed', async ({ messageId, chatId, removerId, chatUsers, isLastMessage }) => {
                  console.log(`user: ${removerId} removed message: ${messageId} from chat: ${chatId}`)

                  chatUsers.forEach((user: User) => {
                        socket.in(user._id).emit('message removed', { messageId, chatId, removerId, isLastMessage })
                  })
            })

            socket.off('setup', () => {
                  socket.leave(socket.id)
            })
      })

      // Function to check for inactive users and emit 'logout' event
      function checkInactiveUsers () {
            const now = Date.now()
            for (const [userId, socket] of activeUsers.entries()) {
                  if (now - socket.handshake.auth.lastActivity > INACTIVITY_THRESHOLD) {
                        socket.broadcast.emit('logout', userId)
                        activeUsers.delete(userId)
                        socket.disconnect(true)
                        updateUserStatus(userId, false)
                        console.log('User logged out due to inactivity:', userId)
                  }
            }
      }

      // Define a function to update lastActivity for a user
      function updateUserActivity (userId: string) {
            const userSocket = activeUsers.get(userId)
            if (userSocket) {
                  userSocket.handshake.auth.lastActivity = Date.now()
                  userSocket.emit('login', userId)
                  console.log('User logged in due to activity:', userId)
                  updateUserStatus(userId, true)
            }
      }

      // Run the checkInactiveUsers function every 15 minute
      setInterval(checkInactiveUsers, 15 * 60 * 1000)
}

function getUserBySocketId (socketId: string) {
      if (gIo && gIo.sockets) {
            const room = gIo.sockets.adapter.rooms.get(socketId)
            if (room) {
                  const [userId] = Array.from(room)
                  return userId
            }
      }
      return null
}
