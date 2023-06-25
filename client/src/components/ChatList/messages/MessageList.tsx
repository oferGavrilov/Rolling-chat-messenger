import { IChat } from "../../../model/chat.model"

import MessagePreview from "./MessagePreview"

export default function MessageList ({ chats }: { chats: IChat[] }) {

      return (
            <ul className="overflow-y-auto h-screen pb-48">
                  {chats.map(chat => (
                        <MessagePreview key={chat._id} chat={chat} />
                  ))}
            </ul>
      )
}
