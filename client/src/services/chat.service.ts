import axios from "axios"
import { authConfig } from "../helpers/config"


export const chatService = {
      getChats,
      getUserChats
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
            return data
      } catch (err) {
            console.log(err)
            return []
      }
}