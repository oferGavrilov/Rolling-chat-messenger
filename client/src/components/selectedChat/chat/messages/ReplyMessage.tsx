import { ReactNode } from 'react'
import { IMessage } from '../../../../model/message.model'
import { Image, Audiotrack, Description } from '@mui/icons-material'

interface Props {
      message: IMessage
      loggedInUserId: string
      incomingMessage: boolean
}

export default function ReplyMessage ({ message, loggedInUserId, incomingMessage }: Props): JSX.Element {

      function getReplyMessageContent (): ReactNode {
            switch (message.replyMessage?.messageType) {
                  case 'text':
                        return message.replyMessage?.content.toString()
                  case 'image':
                        return (
                              <div className='reply-message-color'>
                                    Image <Image className='!text-lg ml-1' />
                              </div>
                        )
                  case 'audio':
                        return (
                              <div className='reply-message-color'>
                                    Audio <Audiotrack className='!text-lg ml-1' />
                              </div>
                        )
                  case 'file':
                        return (
                              <div className='reply-message-color'>
                                    File <Description className='!text-lg ml-1' />
                              </div>
                        )
                  default:
                        return message.replyMessage?.content.toString()
            }
      }

      function getSender (): ReactNode {
            if (message.replyMessage?.sender._id === loggedInUserId) {
                  return (
                        <span className="font-bold font-sans tracking-wider text-[16px] text-lime-400">You</span>
                  )
            }
            return <span className="font-bold font-sans tracking-wider text-[#ffb703]">{message.replyMessage?.sender.username}</span>
      }

      return (
            <div className={`${incomingMessage ? 'ml-auto dark:bg-dark-incoming-chat-bg' : 'dark:bg-dark-outgoing-chat-bg'} text-white rounded-t-xl p-2 w-full`}>
                  <div className={`flex flex-col text-sm py-2  pl-4 rounded-md border-r-4 ${message.replyMessage?.sender._id === loggedInUserId ? 'border-lime-400' : 'border-[#ffb703]'} ${incomingMessage ? 'bg-[#828995] dark:bg-dark-incoming-chat-reply-bg' : 'bg-[#0079ca] dark:bg-dark-outgoing-chat-reply-bg'}`}>
                        {getSender()}
                        <span className="mt-2 min-w-[100px] max-w-[180px] overflow-hidden text-ellipsis mb-1">{getReplyMessageContent()}</span>
                  </div>
            </div>
      )
}
