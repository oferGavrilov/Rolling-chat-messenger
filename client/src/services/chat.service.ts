import axios, { AxiosResponse } from "axios"
import { IChat } from "../model/chat.model"
import { userService } from "./user.service"
import { getAuthConfig, getConfig } from '../utils/authConfig'
import { IMessage } from "../model/message.model"

import { handleAxiosError } from "../utils/handleErrors"
import { IUser } from "../model/user.model"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://rolling-chat-messenger-server.vercel.app' : 'http://localhost:5000'

export const chatService = {
      getChats,
      getUserChats,
      createGroup,
      updateGroupImage,
      updateGroupName,
      kickFromGroup,
      getMessages,
      sendMessage,
      updateUsersGroup,
      removeChat,
      leaveFromGroup
}


async function getChats (): Promise<IChat[]> {
      try {
            const { data }: AxiosResponse<IChat[]> = await axios.get(BASE_URL + '/api/chat', getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            return []
      }
}

async function getUserChats (userId: string): Promise<IChat[]> {
      try {
            const { data }: AxiosResponse<IChat[]> = await axios.get(BASE_URL + `/api/chat/chat/${userId}`, getAuthConfig())
            const sortedData = data.sort((a: IChat, b: IChat) => {
                  const aDate = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                  const bDate = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

                  return bDate - aDate;
            });

            return sortedData;
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error);
            }
            throw new Error('Failed to fetch user chats.');
      }
}


async function createGroup (group: { chatName: string, users: IUser[], groupImage: string }): Promise<IChat> {
      try {
            const { data }: AxiosResponse<IChat> = await axios.post(BASE_URL + '/api/chat/group', group, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to create group.')
      }
}

async function updateGroupImage (chatId: string, groupImage: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put(BASE_URL + '/api/chat/groupimage', { chatId, groupImage }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to update group image.')
      }
}
async function updateGroupName (chatId: string, groupName: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put(BASE_URL + '/api/chat/rename', { chatId, groupName }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to update group name.')
      }
}

async function updateUsersGroup (chatId: string, users: IUser[]) {
      try {
            const { data }: AxiosResponse<IChat> = await axios.put(BASE_URL + '/api/chat/updateusers', { chatId, users }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to update group users.')
      }
}

async function leaveFromGroup (chatId: string, userId: string): Promise<string> {
      try {
            const { data }: AxiosResponse<string> = await axios.put(BASE_URL + '/api/chat/leave', { chatId, userId }, getAuthConfig())
            return data

      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed leave group.')
      }
}

async function kickFromGroup (chatId: string, userId: string, kickedByUserId: string): Promise<IChat> {
      userId = userId || userService.getLoggedinUser()?._id
      try {
            const { data }: AxiosResponse<IChat> = await axios.put(BASE_URL + '/api/chat/kick', { chatId, userId, kickedByUserId }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to remove user from group.')
      }
}

async function getMessages (chatId: string): Promise<IMessage[]> {
      try {
            const { data }: AxiosResponse<IMessage[]> = await axios.get(BASE_URL + `/api/message/${chatId}`, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to fetch messages.')
      }
}

async function sendMessage (
      message: {
            content: string | File,
            chatId: string,
            messageType: string,
            messageSize?: number,
      }): Promise<IMessage> {
      try {
            const { data }: AxiosResponse<IMessage> = await axios.post(BASE_URL + '/api/message', message, getConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to send message.')
      }
}

async function removeChat (chatId: string, userId: string) {
      try {
            const { data }: AxiosResponse<IChat> = await axios.put(BASE_URL + '/api/chat/remove', { chatId, userId }, getAuthConfig())
            return data
      } catch (error) {
            if (axios.isAxiosError(error)) {
                  handleAxiosError(error)
            }
            throw new Error('Failed to remove chat.')
      }
}