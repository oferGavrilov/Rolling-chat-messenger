import { IMessage, IReplyMessage } from "../model/message.model"
import { httpService } from "./http.service"

export const messageService = {
      getMessages,
      sendMessage,
      removeMessage
}

async function getMessages (chatId: string): Promise<IMessage[]> {
      try {
            return httpService.get(`/api/message/${chatId}`, {})
      } catch (error) {
            console.log(error)
            throw new Error('Failed to fetch messages.')
      }
}

async function sendMessage (
      message: {
            content: string | File,
            chatId: string,
            messageType: string,
            replyMessage: IReplyMessage | null,
            messageSize?: number,
      }): Promise<IMessage> {
      try {
            return httpService.post('/api/message', message)
      } catch (error) {
            console.log(error)
            throw new Error('Failed to send message.')
      }
}

async function removeMessage (messageId: string, chatId: string): Promise<void> {
      try {
            return httpService.delete(`/api/message/remove/${chatId}/${messageId}`, {})
      } catch (error) {
            console.log(error)
            throw new Error('Failed to delete message.')
      }
}