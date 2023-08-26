import { ReactNode } from 'react'
import { AuthState } from '../../../../context/useAuth'
import ReplyMessage from './ReplyMessage'
import { IMessage } from '../../../../model/message.model'
import { IUser } from '../../../../model/user.model'
import { formatDate, isSameSenderMargin } from '../../../../utils/functions'
import MessageMenu from './MessageMenu'
import MessageArrow from '../../../../assets/icons/MessageArrow'
import AudioMessage from '../message-type/AudioMessage'
import FileMessage from '../message-type/FileMessage'
import ImageMessage from '../message-type/ImageMessage'
import useChat from '../../../../store/useChat'

interface Props {
      messages: IMessage[]
      message: IMessage
      idx: number
      onReplyMessage: (message: IMessage) => void

}

export default function MessagePreview ({ messages, message, idx, onReplyMessage }: Props): JSX.Element {
      const { user } = AuthState() as { user: IUser }
      const { setSelectedFile } = useChat()

      const renderMessageContent = (message: IMessage, idx: number): ReactNode => {
            if (message.messageType === 'text') {
                  return <span className={`overflow-hidden break-all pr-3 pl-4 ${message.replyMessage ? 'mb-1' : 'py-2 '}`}>{message.content.toString()}</span>
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
                              messages={messages}
                              idx={idx}
                              userId={user._id}
                        />
                  )
            }

            return null
      }

      const incomingMessage = message.sender._id !== user?._id

      return (
            <div className="select-none message-container" onDoubleClick={() => onReplyMessage(message)}>
                  <div
                        className={`select-text relative w-max flex items-center max-w-[75%] text-white rounded-t-2xl  ${message.replyMessage?._id && ' flex-col'}
                                                      ${message?.sender._id === user._id ?
                                    'out-going-message'
                                    : 'incoming-message'}
                                                      ${isSameSenderMargin(messages, message, idx, user._id) ?
                                    'ml-auto rounded-bl-xl ' :
                                    'ml-0 rounded-br-xl flex-row-reverse'}
                                                            ${message.messageType === 'image' && 'flex-col-reverse !px-2 pb-5'}
                                                            ${message.messageType === 'file' && 'flex-col-reverse pb-6'}`}
                  >
                        {/* Reply Message */}
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
                        />

                        {message.sender._id === user._id && (
                              <MessageArrow className='message-arrow-left' />
                        )}
                        <div className={`flex w-full ${message.replyMessage ? 'flex-col' : 'flex-row-reverse'}  ${incomingMessage && '!flex-row justify-between'}`}>
                              {renderMessageContent(message, idx)}

                              <span className={`text-[11px] md:text-xs mr-2 text-gray-100 relative mt-auto mb-1
                                                            ${message.messageType === 'image' && 'left-2 bottom-1 !absolute z-10'}
                                                            ${message.messageType === 'audio' && 'mt-auto bottom-0'}
                                                            ${message.messageType === 'file' && '!absolute bottom-1 left-3'}
                                                            ${isSameSenderMargin(messages, message, idx, user._id) ?
                                          'left-2' : 'text-end'}`}>
                                    {formatDate(message.createdAt)}
                              </span>
                        </div>
                  </div>
            </div>
      )
}
