import { ReactNode } from "react"
import { AuthState } from "../../../context/useAuth"
import { IMessage } from "../../../model/message.model"
import { formatDate, isLastMessage, isSameSender, isSameSenderMargin } from "../../../utils/functions"
import useChat from "../../../store/useChat"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<string>>
}

export default function ChatMessages ({ messages, setChatMode }: Props): JSX.Element {
      const { setSelectedFile } = useChat()
      const { user } = AuthState()

      const renderMessageContent = (message: IMessage): ReactNode => {
            if (message.messageType === 'image' && typeof message.content === 'string') {
                  return (
                        <img
                              className="max-h-[300px] max-w-[200px] object-cover object-top py-1 cursor-pointer"
                              src={message.content}
                              alt="conversation-user"
                              onClick={() => setSelectedFile(message)}

                        />
                  )

            } else if (message.messageType === 'text') {
                  return <span>{message.content.toString()}</span>

            } else if (message.messageType === 'audio') {
                  return (
                        <div>
                              <audio controls={true}>
                                    <source src={message.content.toString()} type="audio/webm" />
                              </audio>
                        </div>
                  );
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
                                                      className="h-10 w-10 rounded-full object-cover object-top cursor-pointer hover:scale-110 transition-all duration-300"
                                                      src={message.sender.profileImg}
                                                      alt="conversation-user"
                                                      onClick={() => setChatMode('info')}
                                                />
                                          ) : <span className="ml-10"></span>}
                                    </div>
                                    <div
                                          className={`pr-3 pl-4 py-1 flex items-center max-w-[75%] rounded-t-xl rounded-tr-2xl relative
                                           ${message?.sender._id === user._id ?
                                                      'bg-primary text-white'
                                                      : 'bg-gray-500 text-white'}
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      'ml-auto rounded-bl-xl' :
                                                      'ml-0 rounded-br-xl flex-row-reverse'}
                                                ${message.messageType === 'image' && 'flex-col-reverse pl-2'}
                                                `}
                                    >
                                          <span className={`text-xs mr-2 text-gray-100 relative -bottom-1 
                                                            ${message.messageType === 'image' && 'left-5 bottom-2 !absolute z-10'}
                                                            ${message.messageType === 'audio' && 'mt-auto bottom-0'}
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
