import { Socket } from "socket.io"
import { SocketOnEvents } from "../socketEvents"
import { roomToUserIdsMap } from "../utils/socketMaps"
import { IUser } from "@/models/user.model"
import { logger } from "@/server"
import { IChat } from "@/models/chat.model"

export const handleNewMessage = (socket: Socket) => {
    socket.on(SocketOnEvents.NEW_MESSAGE, ({ chatId: room, message, chatUsers, senderId }: { chatId: string, message: string, chatUsers: IUser[], senderId: string }) => {
        if (!room || !message || !chatUsers || !senderId) return logger.error('Invalid data for new message.')

        const usersInRoom = roomToUserIdsMap.get(room) || new Set()

        chatUsers.forEach((user: IUser) => {
            if (user._id === senderId) {
                return
            }
            // Check if the user is in the room
            if (usersInRoom.has(user._id)) {
                // Emit message to users in the room
                socket.to(room).emit('new-message-in-room', { chatId: room, message })
            } else {
                // Emit notification to users not in the room
                socket.to(user._id).emit('notification-received', { chatId: room, message })
            }
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.NEW_MESSAGE}] for chat: ${room}, by user: ${senderId}.`)
    })
}

export const handleReadMessages = (socket: Socket) => {
    socket.on(SocketOnEvents.READ_MESSAGES, ({ chatId, userId, messageIds }: { chatId: string, userId: string, messageIds: string[] }) => {
        if (!chatId || !userId || !messageIds) return logger.error('Invalid data for reading messages.')

        const usersInRoom = roomToUserIdsMap.get(chatId) || new Set()
        usersInRoom.forEach((user) => {
            if (user !== userId) {
                socket.to(user).emit('messages-read', { chatId, userId, messageIds })
            }
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.READ_MESSAGES}] for chat: ${chatId}, by user: ${userId}.`)
    })
}

export const handleMessageRemoved = (socket: Socket) => {
    socket.on(SocketOnEvents.MESSAGE_REMOVED, ({ messageId, chatId, removerId, chatUsers }: { messageId: string, chatId: string, removerId: string, chatUsers: IUser[] }) => {
        if (!messageId || !chatId || !removerId || !chatUsers) return logger.error('Invalid data for removing message.')

        chatUsers.forEach((user: IUser) => {
            if (user._id === removerId) return
            socket.in(user._id).emit('removed-message', { messageId, chatId, removerId })
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.MESSAGE_REMOVED}] for chat: ${chatId}, by user: ${removerId}.`)
    })
}

export const handleUpdateGroupInfo = (socket: Socket) => {
    socket.on(SocketOnEvents.UPDATE_GROUP_INFO, ({ chatId, chatUsers, updateType, updateData }: { chatId: string, chatUsers: IUser[], updateType: 'image' | 'name', updateData: string }) => {
        if (!chatId || !chatUsers || !updateType || !updateData) return logger.error('Invalid data for updating group info.')

        chatUsers.forEach((user: IUser) => {
            socket.in(user._id).emit('group-info-updated', { chatId, updateType, updateData })
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.UPDATE_GROUP_INFO}] for chat: ${chatId}.`)
    })
}

export const handleAddedUsersToGroup = (socket: Socket) => {
    socket.on(SocketOnEvents.ADDED_USERS_TO_GROUP, ({ chatId, usersInChat, newUsers }: { chatId: string, usersInChat: IUser[], newUsers: IUser[] }) => {
        if (!chatId || !newUsers || !usersInChat) return logger.error('Invalid data for adding users to group.')
        // notify the new users with the new chat
        newUsers.forEach((user: IUser) => {
            socket.in(user._id).emit('user-joined', { chatId, userId: user._id })
        })

        // notify the existing users in the chat with the new users
        usersInChat.forEach((user: IUser) => {
            socket.in(user._id).emit('group-users-joined', { chatId, newUsers })
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.ADDED_USERS_TO_GROUP}] for chat: ${chatId}.`)
    })
}

export const handleKickedUserFromGroup = (socket: Socket) => {
    socket.on(SocketOnEvents.KICKED_USER_FROM_GROUP, ({ chatId, usersInChat, kickedUserId, kickerId }: { chatId: string, usersInChat: IUser[], kickedUserId: string, kickerId: string }) => {
        if (!chatId || !usersInChat || !kickedUserId) return logger.error('Invalid data for kicking user from group.')

        // notify the kicked user
        socket.in(kickedUserId).emit('user-kicked', { chatId, kickedUserId, kickerId })

        // notify the existing users in the chat with the kicked user
        usersInChat.forEach((user: IUser) => {
            socket.in(user._id).emit('group-user-kicked', { chatId, kickedUserId })
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.KICKED_USER_FROM_GROUP}] for chat: ${chatId}.`)
    })
}

export const handleUserLeaveGroup = (socket: Socket) => {
    socket.on(SocketOnEvents.USER_LEAVE_GROUP, ({ chatId, leaverId, chatUsers }: { chatId: string, leaverId: string, chatUsers: IUser[] }) => {
        if (!chatId || !chatUsers || !leaverId) return logger.error('Invalid data for user leaving group.')

        // notify the existing users in the chat with the leaving user
        chatUsers.forEach((user: IUser) => {
            if (user._id !== leaverId) {
                socket.in(user._id).emit('group-user-left', { chatId, leaverId })
            }
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.USER_LEAVE_GROUP}] for chat: ${chatId}.`)
    })
}

export const handleCreateGroup = (socket: Socket) => {
    socket.on(SocketOnEvents.CREATE_GROUP, ({ users, adminId, group }: { users: IUser[], adminId: string, group: IChat }) => {
        if (!users || !adminId || !group) return logger.error('Invalid data for creating group.')

        const notifiedUsers = users.filter(user => user._id !== adminId)

        if (notifiedUsers.length === 0) return logger.error('No users to notify for new group.')

        notifiedUsers.forEach((user: IUser) => {
            socket.in(user._id).emit('new-group-created', { group })
        })

        logger.info(`[Socket - EVENT ${SocketOnEvents.CREATE_GROUP}] for group: ${group._id}.`)
    })
}
