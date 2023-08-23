import { ReactNode } from "react"

import { AuthState } from "../../../context/useAuth"
import useChat from "../../../store/useChat"

import { IMessage } from "../../../model/message.model"

import { formatDate, formatMessageSentDate, hasDayPassed, isLastMessage, isSameSender, isSameSenderMargin } from "../../../utils/functions"
import AudioMessage from "../chat/message-type/AudioMessage"
import FileMessage from "./message-type/FileMessage"
import ImageMessage from "./message-type/ImageMessage"
import MessageArrow from "../../../assets/icons/MessageArrow"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function ChatMessages ({ messages, setChatMode }: Props): JSX.Element {
      const { setSelectedFile, selectedChat } = useChat()
      const { user } = AuthState()

      const renderMessageContent = (message: IMessage, idx: number): ReactNode => {
            if (message.messageType === 'text') {
                  return <span className="overflow-hidden break-all">{message.content.toString()}</span>
            }
            else if (message.messageType === 'image' && typeof message.content === 'string') {
                  return <ImageMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
                        userId={user?._id as string}
                  />
            } else if (message.messageType === 'file') {
                  return <FileMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
                  />

            } else if (message.messageType === 'audio') {
                  if (!user) return null
                  return (
                        <AudioMessage
                              message={message}
                              messages={messages}
                              idx={idx}
                              userId={user._id}
                        />
                  )
            }

            return null
      }

      function isKicked () {
            if (!selectedChat) return null
            const isKicked = selectedChat?.kickedUsers?.some(kickedUser => kickedUser.userId === user?._id)

            if (isKicked) {
                  return (
                        <div className="mx-auto text-center bg-gray-500 w-max py-2 px-4 my-4 rounded-full">
                              <span className="text-white text-sm">You were kicked from this chat</span>
                        </div>
                  )
            }
      }

      function getDayPass (prevMessage: IMessage, currMessage: IMessage, idx: number) {
            if (idx === 0) {
                  return formatMessageSentDate(messages[0].createdAt)
            }

            if (hasDayPassed(prevMessage.createdAt, currMessage.createdAt)) return formatMessageSentDate(currMessage.createdAt)
      }

      if (!messages || !user) return <div></div>

      return (
            <section className="py-4">
                  {messages &&
                        messages.map((message, idx) => (
                              <div key={message._id} className="flex items-end gap-x-2 py-[2px] px-3">

                                    {/* Profile Image */}
                                    <div className="flex relative">
                                          {(isSameSender(messages, message, idx, user._id) ||
                                                isLastMessage(messages, idx, user._id)) ? (
                                                <div>
                                                      <img
                                                            className="h-8 w-8 hidden md:block rounded-full object-cover object-top cursor-pointer hover:scale-110 transition-all duration-300"
                                                            src={message.sender.profileImg}
                                                            alt="conversation-user"
                                                            onClick={() => setChatMode('info')}
                                                      />
                                                      <MessageArrow className='message-arrow' fill={message?.sender._id === user._id ? '#0099ff' : '#9ca3af'} fillDark={message?.sender._id === user._id ? '#005c4b' : '#202c33'}/>
                                                </div>
                                          ) : <span className="md:ml-8"></span>}
                                    </div>

                                    <div className="flex flex-col w-full">

                                          {/* Send Time of Message */}
                                          <div className="w-max mx-auto">
                                                <div className="bg-gray-400 text-white text-sm px-2 rounded-full" style={getDayPass(messages[idx - 1], message, idx) ? { margin: '12px 0' } : {}}>
                                                      <span>{getDayPass(messages[idx - 1], message, idx)}</span>
                                                </div>
                                          </div>

                                          {/* Message */}
                                          <div
                                                className={`pr-3 pl-4 py-1 w-max flex items-center max-w-[75%] text-white rounded-t-xl rounded-tr-2xl relative
                                                ${message?.sender._id === user._id ?
                                                            'bg-primary dark:bg-dark-outgoing-chat-bg'
                                                            : 'bg-gray-400 dark:bg-dark-incoming-chat-bg'}
                                                      ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                            'ml-auto rounded-bl-xl' :
                                                            'ml-0 rounded-br-xl flex-row-reverse'}
                                                            ${message.messageType === 'image' && 'flex-col-reverse !px-2 pb-5'}
                                                            ${message.messageType === 'file' && 'flex-col-reverse pb-6'}
                                                            `}
                                          >
                                                {message.sender._id === user._id && (
                                                      <MessageArrow className='message-arrow-left' fill={message?.sender._id === user._id ? '#0099ff' : '#9ca3af'} fillDark={message?.sender._id === user._id ? '#005c4b' : '#202c33'}/>
                                                )}
                                                <span className={`text-[11px] md:text-xs mr-2 text-gray-100 relative mt-auto
                                                            ${message.messageType === 'image' && 'left-2 bottom-1 !absolute z-10'}
                                                            ${message.messageType === 'audio' && 'mt-auto bottom-0'}
                                                            ${message.messageType === 'file' && '!absolute bottom-1 left-3'}
                                                            ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                            '-left-1' : '-right-2'}`}>
                                                      {formatDate(message.createdAt)}
                                                </span>
                                                {renderMessageContent(message, idx)}
                                          </div>
                                    </div>
                              </div >
                        ))
                  }

                  {selectedChat?.isGroupChat && isKicked()}
            </section >
      )
}
