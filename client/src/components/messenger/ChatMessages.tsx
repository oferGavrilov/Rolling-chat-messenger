import { AuthState } from "../../context/useAuth"
import { IMessage } from "../../model/message.model"
import { formatTime, isLastMessage, isSameSender, isSameSenderMargin } from "../../utils/functions"

interface Props {
      messages: IMessage[]
}

export default function ChatMessages ({ messages }: Props) {

      const { user } = AuthState()
      return (
            <>
                  {messages &&
                        messages.map((message, idx) => (
                              <div key={message._id} className="flex items-center gap-x-2 py-[2px] px-3">
                                    {(isSameSender(messages, message, idx, user._id) ||
                                          isLastMessage(messages, idx, user._id)) ? (
                                          <img className="h-10 w-10 rounded-full" src={message.sender.profileImg} alt="" />
                                    ) : <span className="ml-10"></span>}
                                    <div
                                          className={`px-3 py-1 flex items-center max-w-[75%] rounded-t-xl rounded-tr-2xl
                                           ${message.sender._id === user._id ?
                                                      'bg-blue-400 text-white' : 'bg-slate-300'}
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      'ml-auto rounded-bl-xl' :
                                                      'ml-0 rounded-br-xl flex-row-reverse'}`}
                                    >
                                          <span className={`text-xs mr-2 text-gray-100 relative -bottom-1
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      '-left-1' : '-right-2'}`}>
                                                {formatTime(message.createdAt)}
                                          </span>
                                          <span>{message.content}</span>
                                    </div>
                              </div >
                        ))
                  }
            </>
      )
}
