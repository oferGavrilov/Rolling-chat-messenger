import { AuthState } from "../../../../context/useAuth"
import useStore from "../../../../context/store/useStore"
import { IMessage, IReplyMessage } from "../../../../model/message.model"
import { isLastMessageFromUser } from "../../../../utils/functions"
import MessagePreview from "./MessagePreview"
import ProfileImage from "../../../common/ProfileImage"
import MessageDateSeparator from "./MessageDateSeparator"
import { messageService } from "../../../../services/message.service"
import socketService from "../../../../services/socket.service"
import { toast } from "react-toastify"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function Messages({ messages, setChatMode }: Props): JSX.Element {
      const { selectedChat, replyMessage, setReplyMessage, setMessages } = useStore()
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

      async function onRemoveMessage(message: IMessage, removerId: string): Promise<void> {
            try {
                  await messageService.removeMessage(message._id, selectedChat?._id as string)
                  setMessages(messages.map((msg) => msg._id === message._id ? { ...msg, deletedBy: [...msg.deletedBy, removerId] } : msg))

                  socketService.emit('message-removed', { messageId: message._id, chatId: selectedChat?._id, removerId, chatUsers: selectedChat?.users })
                  toast.success('Message deleted', { autoClose: 1500 })
            } catch (error) {
                  console.log(error)
            }
      }

      function isUserKicked(): boolean {
            if (!selectedChat) return false;
            return selectedChat.kickedUsers?.some(kickedUser => kickedUser.userId === user?._id);
      }

      if (!messages || !user) return <div></div>

      return (
            <section className={`py-6 ${replyMessage && 'mb-16'}`}>


                  {messages.map((message, idx) => {
                        // Logics to determine if the message is the last one sent by the sender in the entire message array
                        const isUserMessage = message.sender._id === user._id;
                        const isFollowedByDifferentSender = idx < messages.length - 1 && messages[idx + 1].sender._id !== message.sender._id;
                        const shouldShowArrow = isLastMessageFromUser(messages, idx, message.sender._id) || isFollowedByDifferentSender;
                        const arrowDirection = shouldShowArrow ? (isUserMessage ? 'right' : 'left') : 'none';

                        return (

                              <div key={message._id} className="flex items-end gap-x-2 py-[2px] px-3">
                                    <div className="flex relative">
                                          {message.sender._id !== user._id && isLastMessageFromUser(messages, idx, message.sender._id) && (
                                                <div>
                                                      <ProfileImage
                                                            className="default-profile-img h-8 w-8 hidden md:block hover:scale-110"
                                                            src={message.sender.profileImg}
                                                            alt="Sender profile"
                                                            onClick={() => setChatMode('info')}
                                                      />
                                                </div>
                                          )}
                                    </div>

                                    <div className="flex flex-col w-full relative">

                                          {/* Message Time */}
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
                                                arrowDirection={arrowDirection}
                                          />
                                    </div>
                              </div >
                        )

                  })}

                  {selectedChat?.isGroupChat && isUserKicked() && (
                        <div className="mx-auto text-center bg-gray-500 w-max py-2 px-4 my-4 rounded-full">
                              <span className="text-white text-sm">You were kicked from this chat</span>
                        </div>
                  )}
            </section >
      )
}
