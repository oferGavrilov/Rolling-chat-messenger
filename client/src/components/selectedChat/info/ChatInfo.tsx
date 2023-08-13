import { IUser } from "../../../model/user.model"
import { MdDelete } from "react-icons/md"
import useChat from "../../../store/useChat"
import { AuthState } from "../../../context/useAuth"
import { chatService } from "../../../services/chat.service"
import { IMessage } from "../../../model/message.model"
import { useEffect, useRef, useState } from "react"

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
      conversationUser: IUser | undefined
      messages: IMessage[]
}

export default function ChatInfo ({ conversationUser, messages }: Props): JSX.Element {
      const { chats, setChats, selectedChat, setSelectedChat, setSelectedFile } = useChat()
      const { user } = AuthState()

      const [showLeftButton, setShowLeftButton] = useState(false)
      const [showRightButton, setShowRightButton] = useState(false)
      const [showMessagesFiles, setShowMessagesFiles] = useState(false)

      const messagesFilesRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (!messagesFilesRef.current) return

            const container = messagesFilesRef.current
            setShowLeftButton(container.scrollLeft > 0)
            setShowRightButton(
                  container.scrollLeft + container.clientWidth < container.scrollWidth
            )

            const handleScroll = () => {
                  setShowLeftButton(container.scrollLeft > 0)
                  setShowRightButton(
                        container.scrollLeft + container.clientWidth < container.scrollWidth
                  )
            }

            container.addEventListener('scroll', handleScroll)
            return () => {
                  container.removeEventListener('scroll', handleScroll)
            }
      }, [messagesFilesRef])

      const scrollMessagesFiles = (direction: 'left' | 'right') => {
            if (!messagesFilesRef.current) return

            const container = messagesFilesRef.current
            const scrollAmount = 450

            if (direction === 'left') {
                  container.scrollLeft -= scrollAmount
            } else if (direction === 'right') {
                  container.scrollLeft += scrollAmount
            }
      }

      async function onRemoveChat () {
            const chat = chats.find(chat => chat._id === selectedChat?._id)

            if (!chat || !user) return

            await chatService.removeChat(chat._id, user._id)

            const newChats = chats.filter(chat => chat._id !== selectedChat?._id)
            setChats(newChats)
            setSelectedChat(null)
      }


      const messagesFiles = messages.filter(message => message.messageType === 'image')

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

                        <div className="[&>*]:border-y-[6px] flex flex-col h-full gap-y-6 w-full [&>*]:border-gray-200 dark:[&>*]:border-dark-primary-bg">
                              <div className="mt-5 px-6">
                                    <div className="flex flex-col pt-2">
                                          <h2 className="text-lg font-semibold dark:text-dark-primary-text">About</h2>
                                          <p className="text-gray-500 py-2 text-sm dark:text-gray-300">{conversationUser?.about || 'Hello There :) '}</p>
                                    </div>
                              </div>

                              <div className="px-6">
                                    <div className={`flex justify-between items-center py-2 pt-2 text-gray-400 dark:text-gray-300 cursor-pointer dark:hover:text-dark-tertiary-text hover:text-gray-700 ${messagesFiles.length <= 0 && 'pointer-events-none'}`} onClick={() => setShowMessagesFiles(!showMessagesFiles)}>
                                          <h2 className="text-lg">Media links and documents</h2>
                                          <div className="flex items-center">
                                                {messagesFiles.length}
                                                <ExpandMoreIcon />
                                          </div>
                                    </div>

                                    <div className={`flex gap-x-3 overflow-x-auto overflow-y-hidden relative scroll-smooth transition-[height] duration-300 ease-in-out ${showMessagesFiles ? 'h-[280px]' : 'h-[0px]'}`} ref={messagesFilesRef} >
                                          {messagesFiles.map(message => (
                                                <img
                                                      key={message._id}
                                                      className="h-full w-full object-cover min-w-[200px] min-h-[250px] object-center py-1 cursor-pointer"
                                                      src={message.content.toString()}
                                                      alt="conversation-user"
                                                      onClick={() => setSelectedFile(message)}
                                                />
                                          ))}

                                          {showMessagesFiles && showRightButton && (
                                                <div
                                                      className="scroll-arrow-btn right-2"
                                                      onClick={() => scrollMessagesFiles('right')}
                                                >
                                                      <KeyboardArrowRightIcon />
                                                </div>
                                          )}

                                          {showMessagesFiles && showLeftButton && (
                                                <div
                                                      className="scroll-arrow-btn left-2 "
                                                      onClick={() => scrollMessagesFiles('left')}
                                                >
                                                      <KeyboardArrowLeftIcon />
                                                </div>)}
                                    </div>
                              </div>

                              <div>
                                    <div className="py-2 text-red-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-tertiary-bg" onClick={onRemoveChat}>
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
