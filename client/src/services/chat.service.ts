import { IChat } from "../model/chat.model"
import { getLoggedinUser } from "./user.service"

import { IUser } from "../model/user.model"
import { httpService } from "./http.service"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://rolling-backend.onrender.com' : 'http://localhost:5000'
const CHAT_SESSION_KEY = 'userChatsFetched'
// const BASE_URL = "https://rolling-backend.onrender.com"

export const chatService = {
      getUserChats,
      createChat,
      createGroup,
      updateGroupInfo,
      kickFromGroup,
      updateUsersGroup,
      removeChat,
      leaveFromGroup,
      isUserChatsFetched
}

async function getUserChats(userId: string): Promise<IChat[]> {
      try {
            const chats = await httpService.get(BASE_URL + `/api/chat/`, {}) as IChat[]

            const sortedData = chats.sort((a: IChat, b: IChat) => {
                  const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
                  const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0

                  return bDate - aDate
            })

            // save a flag to session storage to indicate that the user has fetched his chats
            sessionStorage.setItem(CHAT_SESSION_KEY, 'true')

            return sortedData
      } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch user chats.')
      }
}

async function createChat(userId: string): Promise<IChat> {
      try {
            const currentUserId = getLoggedinUser()?._id
            return httpService.post(`${BASE_URL}/api/chat/createchat`, { userId, currentUserId })
      } catch (error) {
            console.error(error)
            throw error
      }
}

async function removeChat(chatId: string, userId: string) {
      try {
            return httpService.put('/api/chat/remove', { chatId, userId })
      } catch (error) {
            console.log(error)
            throw new Error('Failed to remove chat.')
      }
}

//////////////////// GROUP - Operations ////////////////////

async function createGroup(group: { chatName: string, users: IUser[], groupImage: string }): Promise<IChat> {
      try {
            return httpService.post(`${BASE_URL}/api/chat/creategroup`, group)
      } catch (error) {
            console.error(error)
            throw new Error('Failed to create group.')
      }
}

async function updateGroupInfo(chatId: string, updateType: 'image' | 'name', updateData: string): Promise<string> {
      try {
            let url: string, dataKey: string
            if (updateType === 'image') {
                  url = `${BASE_URL}/api/chat/groupimage`
                  dataKey = 'groupImage'
            } else if (updateType === 'name') {
                  url = `${BASE_URL}/api/chat/rename`
                  dataKey = 'groupName'
            } else {
                  throw new Error('Invalid update type.')
            }

            return httpService.put(url, { chatId, [dataKey]: updateData })
      } catch (error) {
            console.error(error)
            throw new Error('Failed to update group info.')
      }
}

async function updateUsersGroup(chatId: string, users: IUser[]) {
      try {
            return httpService.put(`${BASE_URL}/api/chat/updateusers`, { chatId, users })

      } catch (error) {
            console.error(error)
            throw new Error('Failed to update group users.')
      }
}

async function leaveFromGroup(chatId: string, userId: string): Promise<string> {
      try {
            return httpService.put(`${BASE_URL}/api/chat/leave`, { chatId, userId })

      } catch (error) {
            console.error(error)
            throw new Error('Failed to leave group.')
      }
}

async function kickFromGroup(chatId: string, userId: string, kickedByUserId: string): Promise<IChat> {
      try {
            return httpService.put(`${BASE_URL}/api/chat/kick`, { chatId, userId, kickedByUserId })
      } catch (error) {
            console.log(error)
            throw new Error('Failed to remove user from group.')
      }
}

function isUserChatsFetched() {
      return sessionStorage.getItem(CHAT_SESSION_KEY)
}