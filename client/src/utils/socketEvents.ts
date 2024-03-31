export enum SocketEmitEvents {
    SETUP = 'setup',
    LOGIN = 'login',
    LOGOUT = 'logout',
    JOIN_ROOM = 'join-room',
    LEAVE_ROOM = 'leave-room',
    TYPING = 'typing',
    STOP_TYPING = 'stop-typing',
    NEW_MESSAGE = 'new-message',
    READ_MESSAGES = 'read-messages',
    MESSAGE_REMOVED = 'message-removed',
    UPDATE_GROUP_INFO = 'update-group-info',
    ADDED_USERS_TO_GROUP = 'added-users-to-group',
    KICKED_USER_FROM_GROUP = 'kicked-user-from-group',
    USER_LEAVE_GROUP = 'user-leave-group',
    CREATE_GROUP = 'create-group',
    // Add more as needed
}

export enum SocketOnEvents {
    LOGIN = 'user-logged-in',
    LOGOUT = 'user-logout',
    USER_TYPING = 'user-typing',
    STOP_TYPING = 'stop-typing',
    NOTIFICATION_RECEIVED = 'notification-received',
    MESSAGE_RECEIVED = 'message-received',
    NEW_MESSAGE_IN_ROOM = 'new-message-in-room',
    MESSAGES_READ = 'messages-read',
    REMOVED_MESSAGE = 'removed-message',
    GROUP_INFO_UPDATED = 'group-info-updated',
    GROUP_USER_JOINED = 'group-user-joined',
    GROUP_USER_KICKED = 'group-user-kicked',
    GROUP_USER_LEFT = 'group-user-left',
    USER_JOINED = 'user-joined',
    USER_KICKED = 'user-kicked',
    NEW_GROUP_CREATED = 'new-group-created',
    // Add more as needed
}
