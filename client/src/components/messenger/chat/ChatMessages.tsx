import { AuthState } from "../../../context/useAuth"
import { IMessage } from "../../../model/message.model"
import { formatDate, isLastMessage, isSameSender, isSameSenderMargin } from "../../../utils/functions"

interface Props {
      messages: IMessage[]
}

export default function ChatMessages ({ messages }: Props) {

      const { user } = AuthState()
      console.log('messages', messages)
      return (
            <>
                  {messages &&
                        messages.map((message, idx) => (
                              <div key={message._id} className="flex items-center gap-x-2 py-[2px] px-3">
                                    <div className="hidden md:flex">
                                          {(isSameSender(messages, message, idx, user._id) ||
                                                isLastMessage(messages, idx, user._id)) ? (
                                                <img className="h-10 w-10 rounded-full object-cover object-top" src={message.sender.profileImg} alt="" />
                                          ) : <span className="ml-10"></span>}
                                    </div>
                                    <div
                                          className={`pr-3 pl-4 py-1 flex items-center max-w-[75%] rounded-t-xl rounded-tr-2xl
                                           ${message?.sender._id === user._id ?
                                                      'bg-primary text-white' : 'bg-slate-300'}
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      'ml-auto rounded-bl-xl' :
                                                      'ml-0 rounded-br-xl flex-row-reverse'}`}
                                    >
                                          <span className={`text-xs mr-2 text-gray-100 relative -bottom-1
                                           ${isSameSenderMargin(messages, message, idx, user._id) ?
                                                      '-left-1' : '-right-2'}`}>
                                                {formatDate(message.createdAt)}
                                          </span>
                                          <span>{message.content}</span>
                                    </div>
                              </div >
                        ))
                  }
            </>
      )
}
