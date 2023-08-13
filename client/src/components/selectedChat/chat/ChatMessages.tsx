import { ReactNode } from "react"
import { AuthState } from "../../../context/useAuth"
import { IMessage } from "../../../model/message.model"
import { formatDate, formatRecordTimer, isLastMessage, isSameSender, isSameSenderMargin } from "../../../utils/functions"
import useChat from "../../../store/useChat"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<string>>
}

export default function ChatMessages ({ messages, setChatMode }: Props): JSX.Element {
      const { setSelectedFile } = useChat()
      const { user } = AuthState()

      const renderMessageContent = (message: IMessage): ReactNode => {
            if (message.messageType === 'text') {
                  return <span>{message.content.toString()}</span>
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
                  return (
                        <div className="relative">
                              <audio controls={true}>
                                    <source src={message.content.toString()} type="audio/webm" />
                              </audio>
                              <img src={message.sender.profileImg} className="w-8 h-8 rounded-full object-cover object-top absolute -left-11 top-1" alt="" />
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
                                                ${message.messageType === 'image' && 'flex-col-reverse pl-2'}
                                                ${message.messageType === 'file' && 'flex-col-reverse pb-6'}
                                                `}
                                    >
                                          <span className={`text-xs mr-2 text-gray-100 relative -bottom-1 
                                                            ${message.messageType === 'image' && 'left-5 bottom-2 !absolute z-10'}
                                                            ${message.messageType === 'audio' && 'mt-auto bottom-0'}
                                                            ${message.messageType === 'file' && '!absolute bottom-1 left-3'}
                                          ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      '-left-1' : '-right-2'}`}>
                                                {formatDate(message.createdAt)}
                                          </span>
                                          {renderMessageContent(message)}
                                    </div>
                              </div >
                        ))
                  }
            </section >
      )
}
