import { IUser } from "../../../model/user.model"
import { MdDelete } from "react-icons/md"
import useChat from "../../../store/useChat"
import { AuthState } from "../../../context/useAuth"
import { chatService } from "../../../services/chat.service"
import { IMessage } from "../../../model/message.model"

import MediaFiles from "./MediaFiles"
import { toast } from "react-toastify"

interface Props {
      conversationUser: IUser | null
      messages: IMessage[]
}

export default function ChatInfo ({ conversationUser, messages }: Props): JSX.Element {
      const { chats, setChats, selectedChat, setSelectedChat } = useChat()
      const { user } = AuthState()

      async function onRemoveChat () {
            const chat = chats.find(chat => chat._id === selectedChat?._id)

            if (!chat || !user) return toast.error('Something went wrong')

            try {
                  await chatService.removeChat(chat._id, user._id)
                  
                  const newChats = chats.filter(chat => chat._id !== selectedChat?._id)
                  setChats(newChats)
                  setSelectedChat(null)
            } catch (error) {
                  console.log(error)
            }
      }

      return (
            <section className="w-full h-full">
                  <div className="flex flex-col items-center h-full">
                        <div className="flex flex-col items-center">
                              <img
                                    src={conversationUser?.profileImg}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-5 object-cover opacity-0 object-top fade-grow-up-profile"
                                    alt="profile"
                              />
                              <span className="text-2xl font-semibold dark:text-dark-primary-text">{conversationUser?.username}</span>
                              <span className="text-gray-500 dark:text-gray-200">{conversationUser?.email}</span>
                        </div>

                        <div className="[&>*]:border-t-[6px] last:border-t-0 flex flex-col h-full w-full [&>*]:border-gray-200 dark:[&>*]:border-[#2f3e46]">
                              <div className="mt-5 px-6">
                                    <div className="flex flex-col pt-2">
                                          <h2 className="text-lg font-semibold dark:text-dark-primary-text">About</h2>
                                          <p className="text-gray-500 py-2 text-sm dark:text-gray-300">{conversationUser?.about || 'Hello There :) '}</p>
                                    </div>
                              </div>

                              <MediaFiles messages={messages}/>

                              <div>
                                    <div className="py-2 text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg" onClick={onRemoveChat}>
                                          <div className="px-6 flex gap-x-2 items-center">
                                                <MdDelete size={22} />
                                                <span>Remove chat</span>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>
      )
}
