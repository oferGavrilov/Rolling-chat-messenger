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
      console.log('userId', userId)
      try {
            const { data } = await axios.get(`/api/chat/chat/${userId}`, authConfig)
            console.log('data', data)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}

async function createGroup(group:IGroup) {
      try {
            const { data } = await axios.post('/api/chat/group', group, authConfig)
            console.log('data', data)
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}