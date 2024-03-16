import { IMessage, IReplyMessage } from "../model/message.model"
import { httpService } from "./http.service"

export const messageService = {
      getMessages,
      sendMessage,
      removeMessage
}
const env = import.meta.env.VITE_NODE_ENV
const BASE_URL = env === 'production' ? 'https://server.rolling-chat.com/api' : 'http://localhost:5000/api'

async function getMessages(chatId: string): Promise<IMessage[]> {
      try {
            return httpService.get<IMessage[]>(`${BASE_URL}/message/${chatId}`, {})
      } catch (error) {
            console.log(error)
            throw new Error('Failed to fetch messages.')
      }
}

async function sendMessage(
      message: {
            content: string | File
            chatId: string,
            messageType: string,
            replyMessage: IReplyMessage | null,
            messageSize?: number,
      }): Promise<IMessage> {
      try {
            return httpService.post(`${BASE_URL}/message`, message)
      } catch (error) {
            console.log(error)
            throw new Error('Failed to send message.')
      }
}

async function removeMessage(
      messageId: string,
      chatId: string,
      deletionType: 'forMe' | 'forEveryone'
): Promise<void> {
      try {
            return httpService.delete(`${BASE_URL}/message/remove/${chatId}/${messageId}`, { deletionType })
      } catch (error) {
            console.log(error)
            throw new Error('Failed to delete message.')
      }
}
