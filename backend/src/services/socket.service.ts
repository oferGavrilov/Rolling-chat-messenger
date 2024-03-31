import type { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import type { IUser } from '@/models/user.model'
import { IChat } from '@/models/chat.model'
import { logger } from '@/server'
import { IMessage } from '@/models/message.model'

let gIo: Server | null = null

const onlineUsers = new Map<string, string>()
// Tracks which rooms a user is in (by user ID)
const userToRoomsMap = new Map<string, Set<string>>()
// Tracks which users (by user ID) are in a room
const roomToUserIdsMap = new Map<string, Set<string>>()


export function setupSocketAPI(http: HttpServer) {
      gIo = new Server(http, {
            cors: {
                  origin: '*',
            }
      })

      gIo.on('connection', (socket: Socket) => {
            logger.info(`Socket ${socket.id} has connected`)

            socket.on('setup', (userId: string) => {
                  socket.join(userId)
                  logger.info(`[Socket - Event: 'setup'] socketID: ${socket.id} joined userId: ${userId}`)
                  socket.broadcast.emit('connected', userId)

                  // Update online users
                  onlineUsers.set(userId, socket.id)

                  // Update userToRoomMap
                  // const rooms = userToRoomsMap.get(userId) || new Set()
                  // rooms.forEach((room) => {
                  //       socket.join(room)
                  // })

                  // // Update roomToUserIdsMap
                  // roomToUserIdsMap.forEach((users, room) => {
                  //       if (users.has(userId)) {
                  //             socket.join(room)
                  //       }
                  // })
            })

            socket.on('login', (userId: string) => {
                  if (!onlineUsers.has(userId)) {
                        logger.info(`[SOCKET - Event:'user-logged-in'] - User connected: ${userId}`)
                        socket.join(userId)
                        onlineUsers.set(userId, socket.id)
                        socket.broadcast.emit('user-logged-in', userId)
                  }
            })

            socket.on('logout', (userId: string) => {
                  logger.info(`[SOCKET - Event:'user-logout'] - User disconnected: ${userId}`)
                  onlineUsers.delete(userId)
                  socket.broadcast.emit('user-logout', userId)
            })

            socket.on('join-room', ({ chatId: room, userId }: { chatId: string, userId: string }) => {
                  socket.join(room)

                  // Update roomToUserIdsMap
                  const usersInRoom = roomToUserIdsMap.get(room) || new Set()
                  usersInRoom.add(userId)
                  roomToUserIdsMap.set(room, usersInRoom)

                  // Update userToRoomsMap
                  const roomsForUser = userToRoomsMap.get(userId) || new Set()
                  roomsForUser.add(room)
                  userToRoomsMap.set(userId, roomsForUser)

                  logger.info(`Socket [id: ${socket.id}] with User [id: ${userId}] joined room: ${room}`)
            })

            socket.on('leave-room', ({ chatId: room, userId }: { chatId: string, userId: string }) => {
                  socket.leave(room)

                  // Update roomToUserIdsMap
                  const usersInRoom = roomToUserIdsMap.get(room)
                  if (usersInRoom) {
                        usersInRoom.delete(userId)
                        if (usersInRoom.size === 0) {
                              roomToUserIdsMap.delete(room)
                        } else {
                              roomToUserIdsMap.set(room, usersInRoom)
                        }
                  }

                  // Update userToRoomsMap
                  const roomsForUser = userToRoomsMap.get(userId)
                  if (roomsForUser) {
                        roomsForUser.delete(room)
                        if (roomsForUser.size === 0) {
                              userToRoomsMap.delete(userId)
                        } else {
                              userToRoomsMap.set(userId, roomsForUser)
                        }
                  }

                  logger.info(`User [id: ${userId}] with Socket [id: ${socket.id}] left room: ${room}`)
            })

            socket.on('typing', ({ chatId: room, userId }: { chatId: string, userId: string }) => {
                  socket.in(room).emit('user-typing', room, userId)
                  logger.info(`Socket [id: ${socket.id}] is typing in room: ${room}`)
            })

            socket.on('stop-typing', ({ chatId: room }: { chatId: string }) => {
                  socket.in(room).emit('stop-typing')
            })

            socket.on('new-message', ({ chatId: room, message, chatUsers, senderId }: { chatId: string, message: IMessage, chatUsers: IUser[], senderId: string }) => {
                  const usersInRoom = roomToUserIdsMap.get(room) || new Set()

                  chatUsers.forEach((user: IUser) => {
                        if (user._id === senderId) {
                              return
                        }
                        // Check if the user is in the room
                        if (usersInRoom.has(user._id)) {
                              // Emit message to users in the room
                              logger.info(`Emitting message-received to user ${user._id} in room ${room}`)
                              socket.to(room).emit('new-message-in-room', { chatId: room, message })
                        } else {
                              // Emit notification to users not in the room
                              logger.info(`Emitting notification-received to user ${user._id}`)
                              gIo?.to(user._id).emit('notification-received', { chatId: room, message })
                        }
                  })
            })

            socket.on('read-messages', ({ chatId, userId, messageIds }: { chatId: string, userId: string, messageIds: string[] }) => {
                  // socket.to(chatId).emit('message-read', { chatId, userId, messages })
                  // logger.info(`Socket [id: ${socket.id}] read messages in room: ${chatId}`)
                  const usersInRoom = roomToUserIdsMap.get(chatId) || new Set()
                  usersInRoom.forEach((user) => {
                        if (user !== userId) {
                              logger.info(`Emitting messages-read to user ${user} in room ${chatId}`)
                              gIo?.to(user).emit('messages-read', { chatId, userId, messageIds })
                        }
                  })

            })

            socket.on('message-removed', ({ messageId, chatId, removerId, chatUsers }: { messageId: string, chatId: string, removerId: string, chatUsers: IUser[] }) => {
                  chatUsers.forEach((user: IUser) => {
                        if (user._id === removerId) return
                        socket.in(user._id).emit('removed-message', { messageId, chatId, removerId })
                  })
                  logger.info(`Emitting removed-message to user ${chatUsers.map(user => user._id).join(', ')} in room ${chatId}`)
            })

            // updated group info
            socket.on('update-group-info', ({ chatId, chatUsers, updateType, updateData }: { chatId: string, chatUsers: IUser[], updateType: 'image' | 'name', updateData: string }) => {
                  chatUsers.forEach((user: IUser) => {
                        socket.in(user._id).emit('group-info-updated', { chatId, updateType, updateData })
                  })
                  logger.info(`Group info updated for chat: ${chatId}. Update type: ${updateType}. Update data: ${updateData}`)
            })

            // when a user is added to a group
            socket.on('added-users-to-group', ({ chatId, usersInChat, newUsers }: { chatId: string, usersInChat: IUser[], newUsers: IUser[] }) => {
                  if (!chatId || !newUsers || !usersInChat) return

                  logger.info(`added users: ${newUsers.map(user => user._id)} to chat: ${chatId}`)

                  // notify the new users with the new chat
                  newUsers.forEach((user: IUser) => {
                        socket.in(user._id).emit('user-joined', { chatId, userId: user._id })
                  })

                  // notify the existing users in the chat with the new users
                  usersInChat.forEach((user: IUser) => {
                        socket.in(user._id).emit('group-users-joined', { chatId, newUsers })
                  })
            })

            // when a user is kicked from a group
            socket.on('kicked-user-from-group', ({ chatId, usersInChat, kickedUserId, kickerId }: { chatId: string, usersInChat: IUser[], kickedUserId: string, kickerId: string }) => {
                  if (!chatId || !kickedUserId || !kickerId) return

                  logger.info(`User: ${kickerId} kicked user: ${kickedUserId} from chat: ${chatId}`)

                  // notify the kicked user
                  socket.in(kickedUserId).emit('user-kicked', { chatId, kickedUserId, kickerId })

                  // notify the other users in the chat with the kicked user
                  usersInChat.forEach((user: IUser) => {
                        socket.in(user._id).emit('group-user-kicked', { chatId, kickedUserId })
                  })
            })

            // when a user leaves a group
            socket.on('user-leave-group', ({ chatId, leaverId, chatUsers }: { chatId: string, leaverId: string, chatUsers: IUser[] }) => {
                  if (!chatId || !leaverId || !chatUsers) return

                  logger.info(`User: ${leaverId} left chat: ${chatId}`)

                  // notify the other users in the chat with the leaver
                  chatUsers.forEach((user: IUser) => {
                        if (user._id !== leaverId) {
                              socket.in(user._id).emit('group-user-left', { chatId, leaverId })
                        }
                  })
            })

            socket.on('create group', ({ users, adminId, group }: { users: IUser[], adminId: string, group: IChat }) => {
                  const notifiedUsers = users.filter(user => user._id !== adminId)

                  logger.info(`Group created by AdminID: ${adminId}. Notifying Users: ${notifiedUsers.map(user => user._id).join(', ')}`)

                  notifiedUsers.forEach((user: IUser) => {
                        socket.to(user._id).emit('new-group-created', group)
                  })
            })

            socket.on('disconnect', () => {
                  userToRoomsMap.forEach((rooms, userId) => {
                        rooms.forEach((room) => {
                              roomToUserIdsMap.get(room)?.delete(userId)
                        })
                        userToRoomsMap.delete(userId)
                  })
                  logger.info(`Socket ${socket.id} has disconnected`)
            })
      })
}
