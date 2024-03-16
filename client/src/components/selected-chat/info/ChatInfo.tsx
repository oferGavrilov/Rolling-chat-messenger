import { IUser } from "../../../model/user.model"
import useStore from "../../../context/store/useStore"
import { AuthState } from "../../../context/useAuth"
import { chatService } from "../../../services/chat.service"
import { IMessage } from "../../../model/message.model"

import MediaFiles from "./MediaFiles"
import { toast } from "react-toastify"
import UserInfo from "../../common/UserInfo"
import RemoveChatButton from "../../common/RemoveChatButton"
import AboutUser from "../../common/AboutUser"
import { IChat } from "../../../model"

interface Props {
      conversationUser: IUser | null
      messages: IMessage[]
}

export default function ChatInfo({ conversationUser, messages }: Props): JSX.Element {
      const { chats, setChats, selectedChat, setSelectedChat, setMessages } = useStore()
      const { user } = AuthState()

      async function onRemoveChat(): Promise<void> {
            if (!selectedChat || !user) {
                  toast.error('Something went wrong')
                  return
            }

            if (!window.confirm('Are you sure you want to remove this chat?')) return

            try {
                  await chatService.removeChat(selectedChat._id, user._id)

                  const newChats: IChat[] = chats.filter(chat => chat._id !== selectedChat?._id)
                  setChats(newChats)
                  setMessages([])
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
