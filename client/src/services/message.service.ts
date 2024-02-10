import { IMessage, IReplyMessage } from "../model/message.model"
import { httpService } from "./http.service"

export const messageService = {
      getMessages,
      sendMessage,
      removeMessage,
}
const env = import.meta.env.VITE_NODE_ENV
const BASE_URL = env === 'production' ? 'https://server.rolling-chat.com' : 'http://localhost:5000'

async function getMessages(chatId: string): Promise<IMessage[]> {
      try {
            return httpService.get<IMessage[]>(`${BASE_URL}/api/message/${chatId}`, {})
      } catch (error) {
            console.log(error)
            throw new Error('Failed to fetch messages.')
      }
}

async function sendMessage(
      message: {
            content: string | File,
            chatId: string,
            messageType: string,
            replyMessage: IReplyMessage | null,
            messageSize?: number,
      }): Promise<IMessage> {
      try {
            return httpService.post(`${BASE_URL}/api/message`, message)
      } catch (error) {
            console.log(error)
            throw new Error('Failed to send message.')
      }
}

async function removeMessage(messageId: string, chatId: string): Promise<void> {
      try {
            return httpService.delete(`${BASE_URL}/api/message/remove/${chatId}/${messageId}`, {})
      } catch (error) {
            console.log(error)
            throw new Error('Failed to delete message.')
      }
}