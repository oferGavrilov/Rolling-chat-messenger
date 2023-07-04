import { User } from "../../../model/user.model"
import { MdKeyboardArrowRight } from "react-icons/md"
import { MdDelete } from "react-icons/md"
import useChat from "../../../store/useChat"
interface Props {
      conversationUser: User
}

export default function ChatInfo ({ conversationUser }: Props) {

      const { chats, setChats, selectedChat, setSelectedChat } = useChat()

      async function onRemoveChat () {
            const chatId = selectedChat._id
            const newChats = chats.filter(chat => chat._id !== chatId)
            setChats(newChats)
            setSelectedChat(null)
      }

      return (
            <section className="w-full h-full">
                  <div className="flex flex-col items-center h-full">
                        <div className="flex flex-col items-center">
                              <img src={conversationUser.profileImg} className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg mb-5 object-cover object-top" alt="profile" />
                              <span className="text-2xl font-semibold">{conversationUser.username}</span>
                              <span className="text-gray-500">{conversationUser.email}</span>
                        </div>

                        <div className="[&>*]:border-y-[6px] flex flex-col  h-full gap-y-6 w-full [&>*]:border-gray-200 [&>*]:px-6">
                              <div className="mt-5">
                                    <div className="flex flex-col pt-2">
                                          <h2 className="text-lg">About</h2>
                                          <p className="text-gray-500 py-2 text-sm">{conversationUser.about || 'Hello There :) '}</p>
                                    </div>
                              </div>

                              <div>
                                    <div className="flex justify-between items-center py-2 pt-2  text-gray-400 cursor-pointer hover:text-gray-700">
                                          <h2 className="text-lg">Media links and documents</h2>
                                          <div className="flex items-center">
                                                0
                                                <MdKeyboardArrowRight size={22} />
                                          </div>
                                    </div>
                              </div>

                              <div>
                                    <div className="flex py-2 items-center gap-x-2 text-red-500 cursor-pointer hover:bg-gray-100" onClick={onRemoveChat}>
                                          <MdDelete size={22} />
                                          <span>Remove chat</span>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>
      )
}
