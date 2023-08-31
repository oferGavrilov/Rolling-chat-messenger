import { AuthState } from "../../../../context/useAuth"
import useChat from "../../../../store/useChat"

import { IMessage, IReplyMessage } from "../../../../model/message.model"

import { formatMessageSentDate, hasDayPassed, isLastMessage, isSameSender } from "../../../../utils/functions"

import MessageArrow from "../../../../assets/icons/MessageArrow"
import MessagePreview from "./MessagePreview"
import ProfileImage from "../../../common/ProfileImage"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      onRemoveMessage: (message: IMessage) => void
}

export default function Messages ({ messages, setChatMode, onRemoveMessage }: Props): JSX.Element {
      const { selectedChat, replyMessage, setReplyMessage } = useChat()
      const { user } = AuthState()



      function getDayPass (prevMessage: IMessage, currMessage: IMessage, idx: number) {
            if (idx === 0) {
                  return formatMessageSentDate(messages[0].createdAt)
            }

            if (hasDayPassed(prevMessage.createdAt, currMessage.createdAt)) return formatMessageSentDate(currMessage.createdAt)
      }

      function onReplyMessage (message: IMessage) {
            if (replyMessage && replyMessage._id === message._id) {
                  setReplyMessage(null)
            } else {
                  const replyMessage: IReplyMessage = {
                        _id: message._id,
                        sender: message.sender!,
                        content: message.content as string,
                        messageType: message.messageType
                  }
                  setReplyMessage(replyMessage)
            }
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

      if (!messages || !user) return <div></div>
      return (
            <section className={`py-6 ${replyMessage && 'mb-16'}`}>
                  {messages.map((message, idx) => (
                        <div key={message._id} className="flex items-end gap-x-2 py-[2px] px-3">

                              {/* Profile Image */}
                              <div className="flex relative">
                                    {(isSameSender(messages, message, idx, user._id) ||
                                          isLastMessage(messages, idx, user._id)) ? (
                                          <div>
                                                <ProfileImage
                                                      className="default-profile-img h-8 w-8 hidden md:block hover:scale-110"
                                                      src={message.sender.profileImg}
                                                      alt="conversation-user"
                                                      onClick={() => setChatMode('info')}
                                                />
                                                <MessageArrow className='message-arrow' />
                                          </div>
                                    ) : <span className="md:pl-8"></span>}
                              </div>

                              <div className="flex flex-col w-full relative">

                                    {/* Send Time of Message */}
                                    <div className="w-max mx-auto">
                                          <div className="bg-gray-400 text-white text-sm px-2 rounded-full" style={getDayPass(messages[idx - 1], message, idx) ? { margin: '12px 0' } : {}}>
                                                <span>{getDayPass(messages[idx - 1], message, idx)}</span>
                                          </div>
                                    </div>

                                    {/* Message */}
                                    <MessagePreview
                                          message={message}
                                          onReplyMessage={onReplyMessage}
                                          onRemoveMessage={onRemoveMessage}
                                    />
                              </div>
                        </div >
                  ))}

                  {selectedChat?.isGroupChat && isKicked()}
            </section >
      )
}