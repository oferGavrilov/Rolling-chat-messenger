import { Server } from 'socket.io';
import { logger } from './logger.service';
import { updateUserStatus } from '../../api/user/service';
let gIo = null;
const activeUsers = new Map();
const INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minute 
// const INACTIVITY_THRESHOLD = 4 * 1000 // 15 minute 
export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    });
    gIo.on('connection', (socket) => {
        console.log('connected to socket.io');
        logger.info('Users connected:', activeUsers.size);
        logger.info(`New connected socket [id: ${socket.id}]`);
        socket.on('setup', (userId) => {
            activeUsers.set(userId, socket);
            socket.join(userId);
            socket.broadcast.emit('connected', userId);
            logger.info(`Socket [id: ${socket.id}] added to userId: ${userId}`);
        });
        socket.on('login', (userId) => {
            activeUsers.set(userId, socket);
            socket.join(userId);
            socket.broadcast.emit('login', userId);
            logger.info(`Socket [id: ${socket.id}] added to userId: ${userId}`);
            logger.info(`Users connected: ${activeUsers.size}`);
        });
        socket.on('logout', (userId) => {
            if (userId) {
                console.log('User disconnected:', userId);
                activeUsers.delete(userId);
                socket.broadcast.emit('logout', userId);
                logger.info(`Users connected: ${activeUsers.size}`);
            }
        });
        socket.on('create group', (users, adminId, group) => {
            users.forEach((user) => {
                if (user._id !== adminId) {
                    socket.to(user._id).emit('new group', group);
                }
            });
        });
        socket.on('join chat', (room) => {
            socket.handshake.auth.lastActivity = Date.now();
            socket.join(room);
            logger.info(`Socket [id: ${socket.id}] joined room: ${room}`);
        });
        socket.on('typing', ({ chatId: room, userId }) => socket.in(room).emit('typing', userId));
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
        socket.on('new message', (newMessageReceived) => {
            socket.handshake.auth.lastActivity = Date.now();
            let chat = newMessageReceived.chat;
            if (!chat)
                return logger.info(`Socket [id: ${socket.id}] tried to send a message without a chat`);
            if (!chat?.users)
                return logger.info(`Socket [id: ${socket.id}] tried to send a message to a chat without users`);
            chat?.users.forEach((user) => {
                if (user._id === newMessageReceived.sender._id)
                    return;
                socket.in(user._id).emit('message received', newMessageReceived);
                logger.info(`Socket [id: ${socket.id}] sent a message to userId: ${user._id}`);
            });
        });
        socket.off('setup', () => {
            socket.leave(socket.id);
        });
    });
    // Function to check for inactive users and emit 'logout' event
    function checkInactiveUsers() {
        const now = Date.now();
        for (const [userId, socket] of activeUsers.entries()) {
            if (now - socket.handshake.auth.lastActivity > INACTIVITY_THRESHOLD) {
                socket.emit('logout', userId);
                activeUsers.delete(userId);
                socket.disconnect(true);
                updateUserStatus(userId);
                console.log('User logged out due to inactivity:', userId);
            }
        }
    }
    // Run the checkInactiveUsers function every 5 minute
    setInterval(checkInactiveUsers, 5 * 60 * 1000);
}
function getUserBySocketId(socketId) {
    if (gIo && gIo.sockets) {
        const room = gIo.sockets.adapter.rooms.get(socketId);
        if (room) {
            const [userId] = Array.from(room);
            return userId;
        }
    }
    return null;
}
