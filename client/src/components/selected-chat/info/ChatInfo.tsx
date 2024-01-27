import { IUser } from "../../../model/user.model"
import useChat from "../../../context/useChat"
import { AuthState } from "../../../context/useAuth"
import { chatService } from "../../../services/chat.service"
import { IMessage } from "../../../model/message.model"

import MediaFiles from "./MediaFiles"
import { toast } from "react-toastify"
import UserInfo from "../../common/UserInfo"
import RemoveChatButton from "../../common/RemoveChatButton"
import AboutUser from "../../common/AboutUser"

interface Props {
      conversationUser: IUser | null
      messages: IMessage[]
}

export default function ChatInfo ({ conversationUser, messages }: Props): JSX.Element {
      const { chats, setChats, selectedChat, setSelectedChat } = useChat()
      const { user } = AuthState()

      async function onRemoveChat () {
            // const chat = chats.find(chat => chat._id === selectedChat?._id)

            // if (!chat || !user) return toast.error('Something went wrong')

            if (!selectedChat || !user) return toast.error('Something went wrong')
            try {
                  await chatService.removeChat(selectedChat._id, user._id)

                  const newChats = chats.filter(chat => chat._id !== selectedChat?._id)
                  setChats(newChats)
                  setSelectedChat(null)
            } catch (error) {
                  console.log(error)
            }
      }

      return (
            <section className="w-full h-full py-12">
                  <div className="flex flex-col items-center h-full">
                        <UserInfo user={conversationUser} />

                        <div className="[&>*]:border-t-[6px] last:border-t-0 flex flex-col h-full w-full [&>*]:border-gray-200 dark:[&>*]:border-[#2f3e46]">
                              <AboutUser user={conversationUser} />

                              <MediaFiles messages={messages} />

                              <RemoveChatButton onRemoveChat={onRemoveChat} />
                        </div>
                  </div>
            </section>
      )
}
