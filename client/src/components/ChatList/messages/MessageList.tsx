import { IChat } from "../../../model/chat.model"

import MessagePreview from "./MessagePreview"

export default function MessageList ({ chats }: { chats: IChat[] }) {

      return (
            <ul >
                  {chats.map(chat => (
                        <MessagePreview key={chat._id} chat={chat} />
                  ))}
            </ul>
      )
}
