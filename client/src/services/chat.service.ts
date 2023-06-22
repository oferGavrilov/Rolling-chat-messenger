import axios from "axios"
import { authConfig } from "../helpers/config"
import { IGroup } from "../model/chat.model"
import { userService } from "./user.service"


export const chatService = {
      getChats,
      getUserChats,
      createGroup,
      updateGroupImage,
      updateGroupName,
      removeFromGroup
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
            return data
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