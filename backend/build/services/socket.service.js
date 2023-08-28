import { Server } from 'socket.io';
import { updateUserStatus } from '../api/user/service.js';
let gIo = null;
const activeUsers = new Map();
const INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minute 
export function setupSocketAPI(http) {
    gIo = new Server(http, {
        cors: {
            origin: '*',
        }
    });
    gIo.on('connection', (socket) => {
        console.log('connected to socket.io');
        console.log('Users connected:', activeUsers.size);
        socket.on('setup', (userId) => {
            activeUsers.set(userId, socket);
            socket.join(userId);
            socket.broadcast.emit('connected', userId);
        });
        socket.on('login', (userId) => {
            activeUsers.set(userId, socket);
            socket.join(userId);
            socket.broadcast.emit('login', userId);
            console.log(`Users connected: ${activeUsers.size}`);
        });
        socket.on('logout', (userId) => {
            if (userId) {
                console.log('User disconnected:', userId);
                activeUsers.delete(userId);
                socket.disconnect(true);
                updateUserStatus(userId, false);
                socket.broadcast.emit('logout', userId);
            }
        });
        socket.on('create group', (users, adminId, group) => {
            users.forEach((user) => {
                if (user._id !== adminId) {
                    socket.to(user._id).emit('new group', group);
                }
            });
        });
        socket.on('join chat', ({ chatId: room, userId }) => {
            socket.handshake.auth.lastActivity = Date.now();
            socket.join(room);
            console.log(`Socket [id: ${socket.id}] joined room: ${room}`);
            updateUserActivity(userId);
        });
        socket.on('leave chat', ({ chatId: room, userId }) => {
            socket.handshake.auth.lastActivity = Date.now();
            socket.leave(room);
            console.log(`Socket [id: ${socket.id}] left room: ${room}`);
            updateUserActivity(userId);
        });
        socket.on('typing', ({ chatId: room, userId }) => {
            socket.in(room).emit('typing', room, userId);
            updateUserActivity(userId);
        });
        socket.on('stop typing', ({ chatId: room, userId }) => {
            socket.in(room).emit('stop typing');
            updateUserActivity(userId);
        });
        socket.on('new message', (newMessageReceived) => {
            console.log('new message received', newMessageReceived);
            socket.handshake.auth.lastActivity = Date.now();
            let chat = newMessageReceived.chat;
            if (!chat)
                return console.log(`Socket [id: ${socket.id}] tried to send a message without a chat`);
            if (!chat?.users)
                return console.log(`Socket [id: ${socket.id}] tried to send a message to a chat without users`);
            chat?.users.forEach((user) => {
                if (user._id === newMessageReceived.sender._id)
                    return;
                socket.in(user._id).emit('message received', newMessageReceived);
                console.log(`Socket [id: ${socket.id}] sent a message to userId: ${user._id}`);
            });
        });
        socket.on('kick-from-group', async ({ chatId, userId, kickerId }) => {
            socket.in(userId).emit('user-kicked', { chatId, userId, kickerId });
        });
        socket.on('add-to-group', async ({ chatId, users, adderId }) => {
            users.forEach((user) => {
                socket.in(user._id).emit('user-joined', { chatId, user, adderId });
            });
        });
        socket.on('leave-from-group', async ({ chatId, userId, chatUsers }) => {
            chatUsers.forEach((user) => {
                if (user._id !== userId) {
                    socket.in(user._id).emit('user-left', { chatId, userId });
                }
            });
        });
        socket.on('message-removed', async ({ messageId, chatId, chatUsers }) => {
            chatUsers.forEach((user) => {
                socket.in(user._id).emit('message removed', { messageId, chatId });
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
                socket.broadcast.emit('logout', userId);
                activeUsers.delete(userId);
                socket.disconnect(true);
                updateUserStatus(userId, false);
                console.log('User logged out due to inactivity:', userId);
            }
        }
    }
    // Define a function to update lastActivity for a user
    function updateUserActivity(userId) {
        const userSocket = activeUsers.get(userId);
        if (userSocket) {
            userSocket.handshake.auth.lastActivity = Date.now();
            userSocket.emit('login', userId);
            console.log('User logged in due to activity:', userId);
            updateUserStatus(userId, true);
        }
    }
    // Run the checkInactiveUsers function every 15 minute
    setInterval(checkInactiveUsers, 15 * 60 * 1000);
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
//# sourceMappingURL=socket.service.js.map