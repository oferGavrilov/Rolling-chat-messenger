import { ReactNode } from 'react'

import { AuthState } from '../../../../context/useAuth'
import useStore from '../../../../context/store/useStore'

import { IMessage } from '../../../../model/message.model'
import { IUser } from '../../../../model/user.model'

import { formatDate } from '../../../../utils/functions'

import MessageArrow from '../../../svg/MessageArrow'

import ReplyMessage from './ReplyMessage'
import MessageMenu from './MessageMenu'

import { DeletedMessage, TextMessage, ImageMessage, FileMessage, AudioMessage } from './message-type'

interface Props {
      message: IMessage
      onReplyMessage: (message: IMessage) => void
      onRemoveMessage: (message: IMessage, deleteAction: 'forMe' | 'forEveryone') => void
      arrowDirection: 'none' | 'left' | 'right'
}

export default function MessagePreview({ message, onReplyMessage, onRemoveMessage, arrowDirection }: Props): JSX.Element {
      const { user } = AuthState() as { user: IUser }
      const { setSelectedFile } = useStore()

      const renderMessageContent = (message: IMessage): ReactNode => {
            if (!user) return null
            // If the message is deleted by the sender, and the deletion type is forEveryone, then show the deleted message component
            if (message.deletedBy.some(deletion => deletion.deletionType === 'forEveryone' && message.sender._id === deletion.userId)) {
                  return (
                        <DeletedMessage />
                  )
            }
            if (message.messageType === 'text') {
                  return <TextMessage message={message} />

            } else if (message.messageType === 'image' && typeof message.content === 'string') {
                  return <ImageMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
                        userId={user._id}
                  />
            } else if (message.messageType === 'file') {
                  return <FileMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
                  />

            } else if (message.messageType === 'audio') {
                  return (
                        <AudioMessage
                              message={message}
                              userId={user._id}
                        />
                  )
            }

            return null
      }

      function handleDoubleClick(message: IMessage): void {
            if (message.deletedBy?.length) return
            onReplyMessage(message)
      }

      function messageStyles({ replyMessage, messageType }: IMessage): string {
            if (replyMessage || messageType === 'image' || messageType === 'file' ||
                  (messageType === 'text' && message.content.toString().length >= 40)) {
                  return 'flex-col'
            }
            if (!incomingMessage) return 'flex-row-reverse'
            return ''
      }

      function getMessageBorderRadius(arrowDirection: 'none' | 'left' | 'right'): string {
            if (arrowDirection === 'none') return 'rounded-xl'
            if (arrowDirection === 'left') return 'rounded-t-2xl rounded-br-2xl'
            return 'rounded-t-2xl rounded-bl-2xl'
      }

      function getReceiptStatus(): ReactNode | null {
            if (message.sender._id !== user._id) return null;

            // if (message.deletedBy.some(deletion => deletion.userId === user._id)) return null;

            const isMessageFullyRead = message.isReadBy?.length === 2;
            const isMessagePartiallyRead = message.isReadBy?.length === 1;

            const iconBaseClass = "material-symbols-outlined text-[18px] mt-auto";
            const fullyReadIconClass = `${iconBaseClass} text-[#00fa9a] dark:text-[#00bfff]`;
            const partiallyReadIconClass = `${iconBaseClass} text-gray-200`;

            if (isMessageFullyRead) {
                  return <span className={fullyReadIconClass}>done_all</span>;
            } else if (isMessagePartiallyRead) {
                  return <span className={partiallyReadIconClass}>done_all</span>;
            } else {
                  return <span className={partiallyReadIconClass}>done</span>;
            }
      }

      if (!message.sender) return <DeletedMessage isUnknownUser={true} />

      const incomingMessage: boolean = message.sender?._id !== user?._id
      return (
            <div className="select-none message-container" onDoubleClick={() => handleDoubleClick(message)}>
                  <div className={`select-text relative w-max flex items-center min-h-8 max-w-[75%] text-white ${getMessageBorderRadius(arrowDirection)} ${message.replyMessage?._id ? 'flex-col' : ''} ${(message.sender._id === user._id) ? 'out-going-message' : 'incoming-message'}`}>
                        {message.replyMessage?._id && (
                              <ReplyMessage
                                    message={message}
                                    loggedInUserId={user._id}
                                    incomingMessage={incomingMessage}
                              />
                        )}

                        <MessageMenu
                              message={message}
                              incomingMessage={incomingMessage}
                              onRemoveMessage={onRemoveMessage}
                        />

                        {arrowDirection !== 'none' && (
                              <MessageArrow className={arrowDirection === 'left' ? 'message-arrow' : 'message-arrow-left'} />
                        )}
                        <div className={`flex w-full ${messageStyles(message)}`}>
                              {renderMessageContent(message)}

                              <div className={`flex my-1 ${incomingMessage ? 'mr-2 flex-row-reverse' : 'ml-2'}`}>
                                    {getReceiptStatus()}
                                    <span className='text-[11px] lg:text-xs text-gray-200 relative mt-auto mx-1'>
                                          {formatDate(message.createdAt)}
                                    </span>
                              </div>
                        </div>
                  </div>
            </div>
      )
}
