import { IMessage, IReplyMessage } from "../model/message.model"
import { httpService } from "./http.service"

export const messageService = {
      getMessages,
      sendMessage,
      removeMessage
}
const env = import.meta.env.VITE_NODE_ENV
const BASE_URL = env === 'production' ? 'https://server.rolling-chat.com/api' : 'http://localhost:5000/api'

async function getMessages(chatId: string): Promise<{ messages: IMessage[], newlyReadMessageIds: string[] }> {
      try {
            return httpService.get<{ messages: IMessage[], newlyReadMessageIds: string[] }>(`${BASE_URL}/message/${chatId}`, {})
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
            file?: File
      }): Promise<IMessage> {
      try {
            const formData = new FormData()

            if (message.file) {
                  formData.append('file', message.file)
            }

            formData.append('content', message.content)
            formData.append('chatId', message.chatId)
            formData.append('messageType', message.messageType)

            if (message.replyMessage) {
                  formData.append('replyMessage', JSON.stringify(message.replyMessage))
            }

            if (message.messageSize) {
                  formData.append('messageSize', message.messageSize.toString())
            }

            const config = {
                  headers: {
                        'Content-Type': 'multipart/form-data'
                  }
            }
            return httpService.post<IMessage>(`${BASE_URL}/message`, formData, config)
      } catch (error) {
            console.log(error)
            throw new Error('Failed to send message.')
      }
}
// async function sendMessage(
//       message: {
//             content: string | File
//             chatId: string,
//             messageType: string,
//             replyMessage: IReplyMessage | null,
//             messageSize?: number,
//             file?: File
//       }): Promise<IMessage> {
//       try {
//             return httpService.post(`${BASE_URL}/message`, message)
//       } catch (error) {
//             console.log(error)
//             throw new Error('Failed to send message.')
//       }
// }

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
