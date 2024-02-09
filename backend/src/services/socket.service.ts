import type { Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import type { User } from '../models/user.model.js'
import { type ChatDocument } from '../models/chat.model.js'
import logger from './logger.service.js'
import { IMessage } from '../models/message.model.js'

let gIo: Server | null = null
const roomToSocketIdsMap = new Map();
const onlineUsers = new Map<string, string>();
const userToRoomMap = new Map();

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
                  if (!onlineUsers.has(userId)) {
                        logger.info(`[SOCKET - Event:'login'] - User connected: ${userId}`)
                        socket.join(userId)
                        onlineUsers.set(userId, socket.id)
                        socket.broadcast.emit('login', userId)
                  }
            })

            socket.on('logout', (userId: string) => {
                  logger.info(`[SOCKET - Event:'logout'] - User disconnected: ${userId}`)
                  onlineUsers.delete(userId)
                  socket.broadcast.emit('logout', userId)
            })

            socket.on('create group', ({ users, adminId, group }: { users: User[], adminId: string, group: ChatDocument }) => {
                  console.log('users', users, 'adminId', adminId, 'group', group)
                  const notifiedUsers = users.filter(user => user._id !== adminId);

                  logger.info(`Group created by AdminID: ${adminId}. Notifying Users: ${notifiedUsers.map(user => user._id).join(', ')}`);

                  notifiedUsers.forEach((user: User) => {
                        socket.to(user._id).emit('new group', group);
                  });
            });

            socket.on('join chat', ({ chatId: room, userId }: { chatId: string, userId: string }) => {
                  socket.join(room);
                  const socketsInRoom = roomToSocketIdsMap.get(room) || new Set();
                  socketsInRoom.add(socket.id);
                  roomToSocketIdsMap.set(room, socketsInRoom);

                  const rooms = userToRoomMap.get(userId) || new Set();
                  rooms.add(room);
                  userToRoomMap.set(userId, rooms);

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

                        // if (callback && typeof callback === 'function') {
                        //       callback({ status: 'success', message: 'Message received' });
                        // }
                  } catch (error) {
                        logger.error(`Error in 'new message in room' handler: ${error}`);
                  }
            });

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

            socket.on('disconnect', () => {
                  logger.info(`Socket ${socket.id} has disconnected`)

                  for (const [room, sockets] of roomToSocketIdsMap.entries()) {
                        if (sockets.has(socket.id)) {
                              sockets.delete(socket.id);
                              if (sockets.size === 0) {
                                    roomToSocketIdsMap.delete(room);
                              } else {
                                    roomToSocketIdsMap.set(room, sockets);
                              }
                              break;
                        }
                  }

                  for (const [userId, socketId] of onlineUsers.entries()) {
                        if (socketId === socket.id) {
                              onlineUsers.delete(userId);
                              gIo?.emit('logout', userId);
                              break;
                        }
                  }
            })
      })
}
