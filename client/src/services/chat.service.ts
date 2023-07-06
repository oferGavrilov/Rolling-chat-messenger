import axios, { AxiosResponse } from "axios"
import { IChat } from "../model/chat.model"
import { userService } from "./user.service"
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { IMessage } from "../model/message.model"

import { handleAxiosError } from "../utils/handleErrors"
import { User } from "../model/user.model"

export const chatService = {
      getChats,
      getUserChats,
      createGroup,
      updateGroupImage,
      updateGroupName,
      removeFromGroup,
      getMessages,
      sendMessage
}


async function getChats (): Promise<IChat[]> {
      try {
            const { data }: AxiosResponse<IChat[]> = await axios.get('/api/chat', getAuthConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            return []
      }
}

async function getUserChats (userId: string): Promise<IChat[]> {
      console.log('getUserChats', userId)
      try {
            const { data }: AxiosResponse<IChat[]> = await axios.get(`/api/chat/chat/${userId}`, getAuthConfig())
            const sortedData = data.sort((a: IChat, b: IChat) => {
                  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            })

            return sortedData
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to fetch user chats.')
      }
}

async function createGroup (group: { chatName: string, users: User[], groupImage: string }): Promise<IChat> {
      try {
            const { data }: AxiosResponse<IChat> = await axios.post('/api/chat/group', group, getAuthConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to create group.')
      }
}

async function updateGroupImage (chatId: string, groupImage: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put('/api/chat/groupimage', { chatId, groupImage }, getAuthConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to update group image.')
      }
}
async function updateGroupName (chatId: string, groupName: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put('/api/chat/rename', { chatId, groupName }, getAuthConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to update group name.')
      }
}

async function removeFromGroup (chatId: string, userId?: string): Promise<IChat> {
      userId = userId || userService.getLoggedinUser()?._id
      try {
            const { data }: AxiosResponse<IChat> = await axios.put('/api/chat/groupremove', { chatId, userId }, getAuthConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to remove user from group.')
      }
}

async function getMessages (chatId: string): Promise<IMessage[]> {
      try {
            const { data }: AxiosResponse<IMessage[]> = await axios.get(`/api/message/${chatId}`, getAuthConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to fetch messages.')
      }
}

async function sendMessage (message: { content: string, chatId: string }): Promise<IMessage> {
      try {
            const { data }: AxiosResponse<IMessage> = await axios.post('/api/message', message, getConfig())
            return data
      } catch (error) {
            handleAxiosError(error)
            throw new Error('Failed to send message.')
      }
}
