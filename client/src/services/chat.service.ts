import axios from "axios"
import { authConfig } from "../helpers/config"
import { IGroup } from "../model/chat.model"


export const chatService = {
      getChats,
      getUserChats,
      createGroup
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
      try {
            const { data } = await axios.get(`/api/chat/chat/${userId}`, authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function createGroup(group:IGroup) {
      try {
            const { data } = await axios.post('/api/chat/group', group, authConfig)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}