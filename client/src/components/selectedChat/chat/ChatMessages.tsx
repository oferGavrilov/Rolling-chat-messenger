import { ReactNode } from "react"

import { AuthState } from "../../../context/useAuth"
import useChat from "../../../store/useChat"

import { IMessage } from "../../../model/message.model"

import { formatDate, isLastMessage, isSameSender, isSameSenderMargin } from "../../../utils/functions"
import AudioMessage from "../chat/message-type/AudioMessage"
import FileMessage from "./message-type/FileMessage"
import ImageMessage from "./message-type/ImageMessage"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function ChatMessages ({ messages, setChatMode }: Props): JSX.Element {
      const { setSelectedFile } = useChat()
      const { user } = AuthState()

      const renderMessageContent = (message: IMessage, idx: number): ReactNode => {
            if (message.messageType === 'text') {
                  return <span className="overflow-hidden break-all">{message.content.toString()}</span>
            }
            else if (message.messageType === 'image' && typeof message.content === 'string') {
                  return <ImageMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
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

      if (!messages || !user) return <div></div>
      return (
            <section className="py-4">
                  {messages &&
                        messages.map((message, idx) => (
                              <div key={message._id} className="flex items-end gap-x-2 py-[2px] px-3">
                                    <div className="hidden md:flex">
                                          {(isSameSender(messages, message, idx, user._id) ||
                                                isLastMessage(messages, idx, user._id)) ? (
                                                <img
                                                      className="h-8 w-8 rounded-full object-cover object-top cursor-pointer hover:scale-110 transition-all duration-300"
                                                      src={message.sender.profileImg}
                                                      alt="conversation-user"
                                                      onClick={() => setChatMode('info')}
                                                />
                                          ) : <span className="ml-8"></span>}
                                    </div>
                                    <div
                                          className={`pr-3 pl-4 py-1 flex items-center max-w-[75%] text-white rounded-t-xl rounded-tr-2xl relative
                                           ${message?.sender._id === user._id ?
                                                      'bg-primary dark:bg-dark-outgoing-chat-bg shadow-lg dark:shadow-gray-700'
                                                      : 'bg-gray-400 dark:bg-dark-incoming-chat-bg shadow-lg'}
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      'ml-auto rounded-bl-xl' :
                                                      'ml-0 rounded-br-xl flex-row-reverse'}
                                                ${message.messageType === 'image' && 'flex-col-reverse !px-2 pb-5'}
                                                ${message.messageType === 'file' && 'flex-col-reverse pb-6'}
                                                `}
                                    >
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
                              </div >
                        ))
                  }
            </section >
      )
}
