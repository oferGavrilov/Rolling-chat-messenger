import { ReactNode } from "react"

import { AuthState } from "../../../context/useAuth"
import useChat from "../../../store/useChat"

import { IMessage } from "../../../model/message.model"

import { formatDate, formatRecordTimer, isLastMessage, isSameSender, isSameSenderMargin } from "../../../utils/functions"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function ChatMessages ({ messages, setChatMode }: Props): JSX.Element {
      const { setSelectedFile } = useChat()
      const { user } = AuthState()

      const renderMessageContent = (message: IMessage, idx: number): ReactNode => {
            if (message.messageType === 'text') {
                  return <span className=" overflow-hidden break-all">{message.content.toString()}</span>
            }
            else if (message.messageType === 'image' && typeof message.content === 'string') {
                  return (
                        <img
                              className="max-h-[300px] max-w-[200px] object-cover object-top py-1 cursor-pointer"
                              src={message.content}
                              alt="conversation-user"
                              onClick={() => setSelectedFile(message)}
                        />
                  )
            } else if (message.messageType === 'file') {
                  return (
                        <div className="relative">
                              <iframe
                                    src={message.content.toString()}
                                    title={message.content.toString()}
                                    className="h-[300px] w-[200px] pointer-events-none overflow-hidden"
                              ></iframe>
                              <div
                                    className="h-[300px] w-[200px] absolute top-0 left-0 cursor-pointer"
                                    onClick={() => setSelectedFile(message)}
                              ></div>
                        </div>
                  );
            } else if (message.messageType === 'audio') {
                  if (!user) return null
                  return (
                        <div className="relative">
                              <audio controls={true} className="max-w-[200px] lg:max-w-none overflow-hidden">
                                    <source src={message.content.toString()} type="audio/webm" />
                              </audio>
                              <img
                                    src={message.sender.profileImg}
                                    alt="profile-image"
                                    className={`${isSameSenderMargin(messages, message, idx, user?._id) ? '-left-11' : '-right-10'} w-8 h-8 rounded-full object-cover object-top absolute top-1`}
                              />
                              {(message?.messageSize !== 0) && <span className="absolute text-black text-xs bottom-0 right-12">{formatRecordTimer(message.messageSize as number)}</span>}
                        </div>
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
                                          className={`pr-3 pl-4 py-1 flex items-center max-w-[75%] rounded-t-xl rounded-tr-2xl relative
                                           ${message?.sender._id === user._id ?
                                                      'bg-primary dark:bg-dark-tertiary-bg text-white'
                                                      : 'bg-gray-400 text-white'}
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      'ml-auto rounded-bl-xl' :
                                                      'ml-0 rounded-br-xl flex-row-reverse'}
                                                ${message.messageType === 'image' && 'flex-col-reverse !px-2 pb-5'}
                                                ${message.messageType === 'file' && 'flex-col-reverse pb-6'}
                                                `}
                                    >
                                          <span className={`text-xs mr-2 text-gray-100 relative mt-auto
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
