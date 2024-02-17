import { AuthState } from "../../../../context/useAuth"
import useStore from "../../../../context/store/useStore"
import { IMessage, IReplyMessage } from "../../../../model/message.model"
import { formatMessageSentDate, hasDayPassed, isLastMessageFromUser } from "../../../../utils/functions"
import MessagePreview from "./MessagePreview"
import ProfileImage from "../../../common/ProfileImage"
import { messageService } from "../../../../services/message.service"
import socketService from "../../../../services/socket.service"
import { toast } from "react-toastify"

interface Props {
      messages: IMessage[]
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
}

export default function Messages({ messages, setChatMode }: Props): JSX.Element {
      const { selectedChat, replyMessage, setReplyMessage, setMessages, removeMessage } = useStore()
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

      async function onRemoveMessage(message: IMessage, deleteAction: 'forMe' | 'forEveryone'): Promise<void> {
            if (!user || !selectedChat) return
            try {
                  await messageService.removeMessage(message._id, selectedChat._id, deleteAction)
                  if (deleteAction === 'forEveryone') {
                        removeMessage(message._id, selectedChat._id, user._id, deleteAction)
                        socketService.emit('message-removed', { messageId: message._id, chatId: selectedChat._id, removerId: user._id, chatUsers: selectedChat.users, deleteAction })

                  } else if (deleteAction === 'forMe') {
                        // await messageService.removeMessage(message._id, selectedChat._id, deleteAction)
                        setMessages(messages.filter((msg) => msg._id !== message._id))
                  }
                  toast.success('Message deleted', { autoClose: 1500 })
            } catch (error) {
                  console.log(error)
            }
      }

      const getSeparatorDate = (prevMessage: IMessage | undefined, currMessage: IMessage, idx: number): string => {
            if (idx === 0 || (prevMessage && hasDayPassed(prevMessage.createdAt, currMessage.createdAt))) {
                  return formatMessageSentDate(currMessage.createdAt);
            }
            return '';
      };

      function isUserKicked(): boolean {
            if (!selectedChat) return false;
            return selectedChat.kickedUsers?.some(kickedUser => kickedUser.userId === user?._id);
      }

      if (!messages || !user) return <div></div>

      return (
            <section className={`pb-6 ${replyMessage ? 'mb-16' : ''}`}>
                  {messages.map((message, idx) => {
                        // Logics to determine if the message is the last one sent by the sender in the entire message array
                        const isUserMessage = message.sender._id === user._id;
                        const isFollowedByDifferentSender = idx < messages.length - 1 && messages[idx + 1].sender._id !== message.sender._id;
                        const shouldShowArrow = isLastMessageFromUser(messages, idx, message.sender._id) || isFollowedByDifferentSender;
                        const arrowDirection = shouldShowArrow ? (isUserMessage ? 'right' : 'left') : 'none';

                        // Logics to determine if between the messages there should be a date separator
                        const formattedDate = getSeparatorDate(messages[idx - 1], message, idx);
                        const displayDateSeparator = !!formattedDate;

                        return (
                              <div key={message._id} className="flex items-end gap-x-2 py-[2px] px-3 relative">
                                    <div className={`flex relative ${displayDateSeparator ? 'mt-9' : ''}`}>
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
                                    {displayDateSeparator && (
                                          <div className="absolute top-0 left-1/2 -translate-x-1/2">
                                                <div className="w-max mx-auto mt-4">
                                                      <div className="bg-gray-400 text-white text-sm px-2 rounded-full select-none">
                                                            <span>{formattedDate}</span>
                                                      </div>
                                                </div>
                                          </div>
                                    )}

                                    <div className={`flex flex-col w-full relative ${displayDateSeparator ? 'mt-9' : ''}`}>
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

                  {/* If The User has been kicked from group */}
                  {selectedChat?.isGroupChat && isUserKicked() && (
                        <div className="mx-auto text-center bg-gray-500 w-max py-2 px-4 my-4 rounded-full">
                              <span className="text-white text-sm">You were kicked from this chat</span>
                        </div>
                  )}
            </section >
      )
}
