import { IChat } from "./chat.model"

export interface IMessage {
      _id: string
      chatId: string
      chat?: IChat
      content: string | File 
      createdAt: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      updatedAt: string,
      messageType: "text" | "image" | "audio" | "file"
      replyMessage: IReplyMessage | null
      messageSize?: number
      deletedBy: string[]
      isReadBy: { userId: string, readAt: Date }[]
}

export type IReplyMessage = {
      _id: string
      sender: {
            _id: string
            username: string
            profileImg: string
      }
      content: string
      messageType: "text" | "image" | "audio" | "file"
}

export interface UploadedFile {
      filename: string
      handle: string
      mimetype: string
      originalFile: {
            name: string
            type: string
            size: number
      }
      originalPath: string
      size: number
      source: string
      status: string
      uploadId: string
      url: string
}