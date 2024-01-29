import type { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import type { User } from '../models/user.model.js'
import { type ChatDocument } from '../models/chat.model.js'
import logger from './logger.service.js'
import { IMessage } from 'src/models/message.model.js'

let gIo: Server | null = null
const roomToSocketIdsMap = new Map();

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
            })

            socket.on('login', (userId: string) => {
                  socket.join(userId)
                  socket.broadcast.emit('login', userId)
                  logger.info(`[SOCKET - Event:'login'] - User connected: ${userId}`)
            })

            socket.on('logout', (userId: string) => {
                  if (userId) {
                        logger.info(`[SOCKET - Event:'logout'] - User disconnected: ${userId}`)
                        socket.disconnect(true)
                        socket.broadcast.emit('logout', userId)
                  }
            })

            socket.on('create group', ({ users, adminId, group }: { users: User[], adminId: string, group: ChatDocument }) => {
                  console.log('users', users, 'adminId', adminId, 'group', group)
                  const notifiedUsers = users.filter(user => user._id !== adminId);

                  logger.info(`Group created by AdminID: ${adminId}. Notifying Users: ${notifiedUsers.map(user => user._id).join(', ')}`);

                  notifiedUsers.forEach((user: User) => {
                        socket.to(user._id).emit('new group', group);
                  });
            });

            socket.on('join chat', ({ chatId: room }: { chatId: string }) => {
                  socket.join(room);
                  const socketsInRoom = roomToSocketIdsMap.get(room) || new Set();
                  socketsInRoom.add(socket.id);
                  roomToSocketIdsMap.set(room, socketsInRoom);
                  logger.info(`Socket [id: ${socket.id}] joined room: ${room}`);
            });

            socket.on('leave chat', ({ chatId: room }: { chatId: string }) => {
                  socket.leave(room);
                  const socketsInRoom = roomToSocketIdsMap.get(room);
                  if (socketsInRoom) {
                        socketsInRoom.delete(socket.id);
                        if (socketsInRoom.size === 0) {
                              roomToSocketIdsMap.delete(room);
                        } else {
                              roomToSocketIdsMap.set(room, socketsInRoom);
                        }
                  }
                  logger.info(`Socket [id: ${socket.id}] left room: ${room}`);
            });

            socket.on('typing', ({ chatId: room, userId }: { chatId: string, userId: string }) => {
                  socket.in(room).emit('typing', room, userId)
                  logger.info(`Socket [id: ${socket.id}] is typing in room: ${room}`);
            })

            socket.on('stop typing', ({ chatId: room }: { chatId: string }) => {
                  socket.in(room).emit('stop typing')
            })

            socket.on('new message in room', async ({ chatId: room, message, chatUsers }: { chatId: string, message: IMessage, chatUsers: User[] }) => {
                  try {
                        // Fetch all socket instances in the room
                        const socketsInRoom = await gIo.in(room).fetchSockets();
                        let isUserInRoom = false
                        chatUsers.forEach((user: User) => {
                              // Check if any socket for the user is in the room
                              isUserInRoom = socketsInRoom.some(s => s.rooms.has(user._id));

                              if (!isUserInRoom) {
                                    gIo.to(user._id).emit('notification', message);
                                    logger.info(`Notification sent to user [id: ${user._id}]`);
                                    return;
                              }

                        });

                        // Send the message to all sockets in the room
                        socket.in(room).emit('message received', message);
                        logger.info(`Socket [id: ${socket.id}] sent a message to room: ${room}`);


                  } catch (error) {
                        logger.error(`Error in 'new message in room' handler: ${error}`);
                  }
            });

            // collapsed to new message in room
            // socket.on('new message in group', (newMessageReceived) => {
            //       const chat = newMessageReceived.chat
            //       if (!chat) return logger.info(`Socket [id: ${socket.id}] tried to send a message without a chat`)
            //       if (!chat?.users) return logger.info(`Socket [id: ${socket.id}] tried to send a message to a chat without users`)
            //       chat.users.forEach((user: User) => {
            //             if (user._id === newMessageReceived.sender._id) return
            //             socket.in(user._id).emit('message received', newMessageReceived)
            //             logger.info(`[SOCKET - Event 'new message'] SocketID: ${socket.id}] sent a message to chat: ${newMessageReceived.chat._id}`)
            //       })
            // })

            socket.on('kick-from-group', ({ chatId, userId, kickerId }: { chatId: string, userId: string, kickerId: string }) => {
                  socket.in(userId).emit('user-kicked', { chatId, userId, kickerId })
                  logger.info(`user: ${kickerId} kicked user: ${userId} from chat: ${chatId}`)
            })

            socket.on('add-to-group', ({ chatId, users, adderId }: { chatId: string, users: User[], adderId: string }) => {
                  logger.info(`user: ${adderId} added users: ${users.map(user => user._id)} to chat: ${chatId}`)

                  users.forEach((user: User) => {
                        socket.in(user._id).emit('user-joined', { chatId, user, adderId })
                  })
            })

            socket.on('leave-from-group', ({ chatId, userId, chatUsers }: { chatId: string, userId: string, chatUsers: User[] }) => {
                  console.log(`user: ${userId} left chat: ${chatId}`)

                  chatUsers.forEach((user: User) => {
                        if (user._id !== userId) {
                              socket.in(user._id).emit('user-left', { chatId, userId })
                        }
                  })
            })

            socket.on('message-removed', ({ messageId, chatId, removerId, chatUsers }: { messageId: string, chatId: string, removerId: string, chatUsers: User[] }) => {
                  console.log(`user: ${removerId} removed message: ${messageId} from chat: ${chatId}`)

                  chatUsers.forEach((user: User) => {
                        socket.in(user._id).emit('message removed', { messageId, chatId, removerId })
                  })
            })

            socket.off('setup', () => {
                  socket.leave(socket.id)
            })
      })
}
