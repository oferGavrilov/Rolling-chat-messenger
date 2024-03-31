export enum SocketOnEvents {
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
    CREATE_GROUP = 'create-group'
}

export enum SocketEmitEvents {
    USER_LOGGING_IN = 'user-logging-in',
    USER_LOGOUT = 'user-logout',
    USER_TYPING = 'user-typing',
    STOP_TYPING = 'stop-typing',
    NEW_MESSAGE_IN_ROOM = 'new-message-in-room',
    NOTIFICATION_RECEIVED = 'notification-received',
    MESSAGES_READ = 'messages-read',
    REMOVED_MESSAGE = 'removed-message',
    GROUP_INFO_UPDATED = 'group-info-updated',
    USER_JOINED = 'user-joined',
    GROUP_USER_JOINED = 'group-user-joined',
    USER_KICKED = 'user-kicked',
    GROUP_USER_KICKED = 'group-user-kicked',
    GROUP_USER_LEFT = 'group-user-left',
    NEW_GROUP_CREATED = 'new-group-created'
}