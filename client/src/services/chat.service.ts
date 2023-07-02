import axios from "axios"
import { IGroup } from "../model/chat.model"
import { userService } from "./user.service"

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
const authConfig = {
      headers: {
            Authorization: `Bearer ${userService.getLoggedinUser()?.token}`
      }
}

async function getChats () {
      try {
            const { data } = await axios.get('/api/chat', authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function getUserChats (userId: string) {
      const auth = {
            headers: {
                  Authorization: `Bearer ${userService.getLoggedinUser()?.token}`
            }
      }
      try {
            const { data } = await axios.get(`/api/chat/chat/${userId}`, auth)
            const sortedData = data.sort((a: any, b: any) => {
                  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            })

            return sortedData
      } catch (err) {
            console.log(err)
            return []
      }
}

async function createGroup (group: IGroup) {
      try {
            const { data } = await axios.post('/api/chat/group', group, authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function updateGroupImage (chatId: string, groupImage: string) {
      try {
            const { data } = await axios.put('/api/chat/groupimage', { chatId, groupImage }, authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function updateGroupName (chatId: string, groupName: string) {
      try {
            const { data } = await axios.put('/api/chat/rename', { chatId, groupName }, authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function removeFromGroup (chatId: string, userId?: string) {
      userId = userId || userService.getLoggedinUser()?._id
      try {
            const { data } = await axios.put('/api/chat/groupremove', { chatId, userId }, authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function getMessages (chatId: string) {
      const auth = {
            headers: {
                  Authorization: `Bearer ${userService.getLoggedinUser()?.token}`
            }
      }
      try {
            const { data } = await axios.get(`/api/message/${chatId}`, auth)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function sendMessage (message: { content: string, chatId: string }) {
      const config = {
            headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${userService.getLoggedinUser()?.token}`
            }
      }
      try {
            const { data } = await axios.post('/api/message', message, config)
            console.log('from chat service', data)
            return data
      } catch (err) {
            console.log(err)
      }
}