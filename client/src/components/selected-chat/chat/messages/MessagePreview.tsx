import { ReactNode } from 'react'

import { AuthState } from '../../../../context/useAuth'
import useChat from '../../../../context/useChat'

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
      onRemoveMessage: (message: IMessage, removerId: string) => void
}

export default function MessagePreview({ message, onReplyMessage, onRemoveMessage }: Props): JSX.Element {
      const { user } = AuthState() as { user: IUser }
      const { setSelectedFile } = useChat()

      const renderMessageContent = (message: IMessage): ReactNode => {
            // If the message is deleted by the sender, show a message that the message was deleted
            if (message.deletedBy?.length) {
                  return (
                        <DeletedMessage />
                  )
            }

            if (message.messageType === 'text') {
                  return <TextMessage message={message} />
            }
            else if (message.messageType === 'image' && typeof message.content === 'string') {
                  return <ImageMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
                        userId={user?._id as string}
                  />
            } else if (message.messageType === 'file') {
                  return <FileMessage
                        message={message}
                        setSelectedFile={setSelectedFile}
                  />

            } else if (message.messageType === 'audio') {
                  if (!user) return null
                  return (
                        <AudioMessage
                              message={message}
                              userId={user._id}
                        />
                  )
            }

            return null
      }

      function handleDoubleClick(message: IMessage) {
            if (message.deletedBy?.length) return
            onReplyMessage(message)
      }

      function messageStyles({ replyMessage, messageType }: IMessage) {
            if (replyMessage || messageType === 'image' || messageType === 'file' ||
                  (messageType === 'text' && message.content.toString().length >= 40)) {
                  return 'flex-col'
            }
            if (!incomingMessage) return 'flex-row-reverse'
      }

      if (!message.sender) return <DeletedMessage isUnknownUser={true} />

      const incomingMessage = message.sender?._id !== user?._id
      return (
            <div className="select-none message-container" onDoubleClick={() => handleDoubleClick(message)}>
                  <div
                        className={`select-text relative w-max flex items-center max-w-[75%] text-white rounded-t-2xl 
                                    ${message.replyMessage?._id && 'flex-col'}
                                    ${(message.sender._id === user._id) ? 'out-going-message' : 'incoming-message'}`}
                  >
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

                        {message.sender._id === user._id && (
                              <MessageArrow className='message-arrow-left' />
                        )}
                        <div className={`flex w-full ${messageStyles(message)}`}>
                              {renderMessageContent(message)}

                              <div className={`flex my-1 ${incomingMessage ? 'mr-2 flex-row-reverse' : 'ml-2'}`}>
                                    {!incomingMessage && <span className="material-symbols-outlined text-[14px] text-gray-200 mt-auto">done_all</span>}
                                    <span className='text-[11px] md:text-xs text-gray-200 relative mt-auto ml-2 mx-1'>
                                          {formatDate(message.createdAt)}
                                    </span>
                              </div>
                        </div>
                  </div>
            </div>
      )
}
