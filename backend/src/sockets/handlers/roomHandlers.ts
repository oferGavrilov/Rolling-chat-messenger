import { Socket } from "socket.io"
import { SocketEmitEvents, SocketOnEvents } from "../socketEvents"
import { roomToUserIdsMap, userToRoomsMap } from "../utils/socketMaps"
import { logger } from "@/server"

export const handleJoinRoom = (socket: Socket) => {
    socket.on(SocketOnEvents.JOIN_ROOM, ({ chatId: room, userId }: { chatId: string, userId: string }) => {
        socket.join(room)

        const roomUsers = roomToUserIdsMap.get(room) || new Set()
        roomUsers.add(userId)
        roomToUserIdsMap.set(room, roomUsers)

        const userRooms = userToRoomsMap.get(userId) || new Set()
        userRooms.add(room)
        userToRoomsMap.set(userId, userRooms)

        logger.info(`[Socket - Event: 'join-room'] Socket ID: ${socket.id} joined Room: ${room} - User ID: ${userId}`);
    })
}

export const handleLeaveRoom = (socket: Socket) => {
    socket.on(SocketOnEvents.LEAVE_ROOM, ({ chatId: room, userId }: { chatId: string, userId: string }) => {
        socket.leave(room)

        const roomUsers = roomToUserIdsMap.get(room)
        roomUsers?.delete(userId)

        if (roomUsers && roomUsers.size === 0) {
            roomToUserIdsMap.delete(room)
        }

        const userRooms = userToRoomsMap.get(userId)
        userRooms?.delete(room)

        if (userRooms && userRooms.size === 0) {
            userToRoomsMap.delete(userId)
        }

        logger.info(`[Socket - Event: 'leave-room'] Socket ID: ${socket.id} left Room: ${room} - User ID: ${userId}`);
    })
}

export const handleTyping = (socket: Socket) => {
    socket.on(SocketOnEvents.TYPING, ({ chatId: room, userId }: { chatId: string, userId: string }) => {
        // socket.to(room).emit(SocketEmitEvents.USER_TYPING, userId)
        socket.broadcast.to(room).emit(SocketEmitEvents.USER_TYPING, userId)
    })
}

export const handleStopTyping = (socket: Socket) => {
    socket.on(SocketOnEvents.STOP_TYPING, ({ chatId: room, userId }: { chatId: string, userId: string }) => {
        // socket.to(room).emit(SocketEmitEvents.STOP_TYPING, userId)
        socket.broadcast.to(room).emit(SocketEmitEvents.STOP_TYPING, userId)
    })
}