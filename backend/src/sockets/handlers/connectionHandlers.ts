import { Socket } from "socket.io"
import { onlineUsers, roomToUserIdsMap, userToRoomsMap } from "../utils/socketMaps"
import { SocketEmitEvents, SocketOnEvents } from "../socketEvents"
import { logger } from "@/server"

export const handleSetup = (socket: Socket) => {
    socket.on(SocketOnEvents.SETUP, (userId: string) => {
        const existingSocketId = onlineUsers.get(userId)

        if (existingSocketId && existingSocketId !== socket.id) {
            logger.info(`User ID: ${userId} reconnecting with a new socket ID: ${socket.id}, replacing the existing socket ID.`)

            // Clean up the room subscription for the user
            const rooms = userToRoomsMap.get(userId)
            if (rooms) {
                rooms.forEach(room => {
                    const roomUsers = roomToUserIdsMap.get(room)
                    roomUsers?.delete(userId)

                    if (roomUsers && roomUsers.size === 0) {
                        userToRoomsMap.delete(room) // cleanup empty rooms
                    }

                })
                userToRoomsMap.delete(userId) // Clear the user's room subscriptions
            }
        }

        onlineUsers.set(userId, socket.id)
        socket.join(userId)
        logger.info(`[Socket - Event: 'setup'] Socket ID: ${socket.id} joined User ID: ${userId}`)

        // Rejoin the user to all rooms they were in before disconnecting
        const rooms = userToRoomsMap.get(userId) || new Set()
        rooms.forEach(room => socket.join(room))
    })
}

export const handleLogin = (socket: Socket) => {
    socket.on(SocketOnEvents.LOGIN, (userId: string) => {
        console.log('LOGIN SOCKET - userId:', userId)
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, socket.id)
            socket.join(userId)
            //logger.info(`[Socket - Event: 'login'] Socket ID: ${socket.id} joined User ID: ${userId}`)
            logger.info(`Emitting USER_LOGGING_IN with status true for userId: ${userId}`)

            socket.emit(SocketEmitEvents.USER_LOGGING_IN, { userId, status: true })
        }
    })
}

export const handleLogout = (socket: Socket) => {
    socket.on(SocketOnEvents.LOGOUT, (userId: string) => {
        // Clean up the room subscription for the user
        const rooms = userToRoomsMap.get(userId)
        if (rooms) {
            rooms.forEach(room => {
                socket.leave(room)
                const roomUsers = roomToUserIdsMap.get(room)
                roomUsers?.delete(userId)

                if (roomUsers && roomUsers.size === 0) {
                    userToRoomsMap.delete(room) // cleanup empty rooms
                }

            })
            userToRoomsMap.delete(userId) // Clear the user's room subscriptions
        }

        onlineUsers.delete(userId)
        logger.info(`[Socket - Event: 'logout'] Socket ID: ${socket.id} left - User ID: ${userId}`)
        socket.broadcast.emit(SocketEmitEvents.USER_LOGOUT, { userId, status: false })
    })
}

export const handleDisconnect = (socket: Socket) => {
    socket.on('disconnect', () => {
        const userId = onlineUsers.get(socket.id)

        if (userId) {
            // Clean up the room subscription for the user
            const rooms = userToRoomsMap.get(userId)
            if (rooms) {
                rooms.forEach(room => {
                    const roomUsers = roomToUserIdsMap.get(room)
                    roomUsers?.delete(userId)

                    if (roomUsers && roomUsers.size === 0) {
                        userToRoomsMap.delete(room) // cleanup empty rooms
                    }

                })
                userToRoomsMap.delete(userId) // Clear the user's room subscriptions
            }

            // remove the user from the online users list
            onlineUsers.delete(userId)
            logger.info(`[Socket - Event: 'disconnect'] Socket ID: ${socket.id} left - User ID: ${userId}`)
            // socket.broadcast.emit(SocketEmitEvents.USER_LOGOUT, userId) // optionally notify other users
        }
    })
}