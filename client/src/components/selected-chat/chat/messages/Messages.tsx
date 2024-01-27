import { AuthState } from "../../../../context/useAuth"
import useChat from "../../../../context/useChat"
import { IMessage, IReplyMessage } from "../../../../model/message.model"
import { isLastMessage, isSameSender } from "../../../../utils/functions"
import MessageArrow from "../../../svg/MessageArrow"
import MessagePreview from "./MessagePreview"
import ProfileImage from "../../../common/ProfileImage"
import MessageDateSeparator from "./MessageDateSeparator"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
      onRemoveMessage: (message: IMessage, removerId: string) => void
}

export default function Messages({ messages, setChatMode, onRemoveMessage }: Props): JSX.Element {
      const { selectedChat, replyMessage, setReplyMessage } = useChat()
      const { user } = AuthState()

      function onReplyMessage(message: IMessage): void {
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

      function isUserKicked(): boolean {
            if (!selectedChat) return false;
            return selectedChat.kickedUsers?.some(kickedUser => kickedUser.userId === user?._id);
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

                                    {/* Day of Message */}
                                    <MessageDateSeparator
                                          prevMessage={messages[idx - 1]}
                                          currMessage={message}
                                          idx={idx}
                                    />

                                    {/* Message */}
                                    <MessagePreview
                                          message={message}
                                          onReplyMessage={onReplyMessage}
                                          onRemoveMessage={onRemoveMessage}
                                    />
                              </div>
                        </div >
                  ))}

                  {selectedChat?.isGroupChat && isUserKicked() && (
                        <div className="mx-auto text-center bg-gray-500 w-max py-2 px-4 my-4 rounded-full">
                              <span className="text-white text-sm">You were kicked from this chat</span>
                        </div>
                  )}
            </section >
      )
}
