// Tracks which rooms a user is in (by user ID)
export const userToRoomsMap = new Map<string, Set<string>>()
// Tracks which users (by user ID) are in a room
export const roomToUserIdsMap = new Map<string, Set<string>>()
// Tracks online users
export const onlineUsers = new Map<string, string>()
