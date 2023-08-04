import { IChat } from "./chat.model"

export interface IMessage {
      count?: number
      _id: string
      chat: IChat
      content: string | File
      createdAt: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      updatedAt: string,
      messageType: "text" | "image" | "audio"
}