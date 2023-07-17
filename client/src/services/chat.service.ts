import axios, { AxiosResponse } from "axios"
import { IChat } from "../model/chat.model"
import { userService } from "./user.service"
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { IMessage } from "../model/message.model"

import { handleAxiosError } from "../utils/handleErrors"
import { User } from "../model/user.model"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://rolling-2szg.onrender.com' : 'http://localhost:5000'

export const chatService = {
      getChats,
      getUserChats,
      createGroup,
      updateGroupImage,
      updateGroupName,
      removeFromGroup,
      getMessages,
      sendMessage,
      updateUsersGroup,
      removeChat
}


async function getChats (): Promise<IChat[]> {
      try {
            const { data }: AxiosResponse<IChat[]> = await axios.get(BASE_URL+'/api/chat', getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            return []
      }
}

async function getUserChats (userId: string): Promise<IChat[]> {
      try {
            const { data }: AxiosResponse<IChat[]> = await axios.get(BASE_URL+`/api/chat/chat/${userId}`, getAuthConfig())
            const sortedData = data.sort((a: IChat, b: IChat) => {
                  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            })

            return sortedData
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to fetch user chats.');
      }
}

async function createGroup (group: { chatName: string, users: User[], groupImage: string }): Promise<IChat> {
      try {
            const { data }: AxiosResponse<IChat> = await axios.post(BASE_URL+'/api/chat/group', group, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to create group.')
      }
}

async function updateGroupImage (chatId: string, groupImage: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put(BASE_URL+'/api/chat/groupimage', { chatId, groupImage }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to update group image.')
      }
}
async function updateGroupName (chatId: string, groupName: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put(BASE_URL+'/api/chat/rename', { chatId, groupName }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to update group name.')
      }
}

async function updateUsersGroup (chatId: string, users: User[]) {
      try {
            const { data }: AxiosResponse<IChat> = await axios.put(BASE_URL+'/api/chat/updateusers', { chatId, users }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to update group users.')
      }
}

async function removeFromGroup (chatId: string, userId?: string): Promise<IChat> {
      userId = userId || userService.getLoggedinUser()?._id
      try {
            const { data }: AxiosResponse<IChat> = await axios.put(BASE_URL+'/api/chat/groupremove', { chatId, userId }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to remove user from group.')
      }
}

async function getMessages (chatId: string): Promise<IMessage[]> {
      try {
            const { data }: AxiosResponse<IMessage[]> = await axios.get(BASE_URL+`/api/message/${chatId}`, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to fetch messages.')
      }
}

async function sendMessage (message: { content: string, chatId: string }): Promise<IMessage> {
      try {
            const { data }: AxiosResponse<IMessage> = await axios.post(BASE_URL+'/api/message', message, getConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to send message.')
      }
}

async function removeChat (chatId: string, userId: string) {
      try {
            const { data }: AxiosResponse<IChat> = await axios.put(BASE_URL+'/api/chat/remove', { chatId, userId }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to remove chat.')
      }
}
