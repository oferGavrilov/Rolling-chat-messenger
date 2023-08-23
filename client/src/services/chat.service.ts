import { IChat } from "../model/chat.model"
import { getLoggedinUser } from "./user.service"

import { IUser } from "../model/user.model"
import { httpService } from "./http.service"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://rolling-chat-messenger-server.vercel.app' : 'http://localhost:5000'

export const chatService = {
      getUserChats,
      createChat,
      createGroup,
      updateGroupImage,
      updateGroupName,
      kickFromGroup,
      updateUsersGroup,
      removeChat,
      leaveFromGroup
}

async function getUserChats (userId: string): Promise<IChat[]> {
      try {
            const chats = await httpService.get(BASE_URL + `/api/chat/chat/${userId}`, {}) as IChat[]

            const sortedData = chats.sort((a: IChat, b: IChat) => {
                  const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
                  const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0

                  return bDate - aDate
            })

            return sortedData
      } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch user chats.')
      }
}

async function createChat (userId: string): Promise<IChat> {
      try {
            const currentUserId = getLoggedinUser()?._id
            return httpService.post('/api/chat', { userId, currentUserId })
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function removeChat (chatId: string, userId: string) {
      try {
            return httpService.put('/api/chat/remove', { chatId, userId })
      } catch (error) {
            console.log(error)
            throw new Error('Failed to remove chat.')
      }
}

//////////////////// GROUP - Operations ////////////////////

async function createGroup (group: { chatName: string, users: IUser[], groupImage: string }): Promise<IChat> {
      try {
            return httpService.post('/api/chat/group', group)
      } catch (error) {
            console.error(error)
            throw new Error('Failed to create group.')
      }
}

async function updateGroupImage (chatId: string, groupImage: string): Promise<string> {
      try {
            return httpService.put(BASE_URL + '/api/chat/groupimage', { chatId, groupImage })
      } catch (error) {
            console.error(error)
            throw new Error('Failed to update group image.')
      }
}

async function updateGroupName (chatId: string, groupName: string): Promise<string> {
      try {
            return httpService.put('/api/chat/rename', { chatId, groupName })
      } catch (error) {
            console.error(error)
            throw new Error('Failed to update group name.')
      }
}

async function updateUsersGroup (chatId: string, users: IUser[]) {
      try {
            return httpService.put('/api/chat/updateusers', { chatId, users })

      } catch (error) {
            console.error(error)
            throw new Error('Failed to update group users.')
      }
}

async function leaveFromGroup (chatId: string, userId: string): Promise<string> {
      try {
            return httpService.put('/api/chat/leave', { chatId, userId })

      } catch (error) {
            console.error(error)
            throw new Error('Failed to leave group.')
      }
}

async function kickFromGroup (chatId: string, userId: string, kickedByUserId: string): Promise<IChat> {
      try {
            return httpService.put('/api/chat/kick', { chatId, userId, kickedByUserId })
      } catch (error) {
            console.log(error)
            throw new Error('Failed to remove user from group.')
      }
}
