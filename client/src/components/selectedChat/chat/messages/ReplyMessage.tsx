import { IMessage } from '../../../../model/message.model'

interface Props {
      message: IMessage
      loggedInUserId: string
      incomingMessage: boolean
}

export default function ReplyMessage ({ message, loggedInUserId, incomingMessage }: Props): JSX.Element {


      return (
            <div className={`${incomingMessage ? 'ml-auto dark:bg-dark-incoming-chat-bg' : 'dark:bg-dark-outgoing-chat-bg'} text-white rounded-t-xl p-2 w-full`}>
                  <div className={`flex flex-col text-sm py-2  pl-4 rounded-md border-r-4 border-[#ffb703] ${incomingMessage ? 'bg-[#828995] dark:bg-dark-incoming-chat-reply-bg' : 'bg-[#0079ca] dark:bg-dark-outgoing-chat-reply-bg'}`}>
                        <span className="font-semibold text-[#ffb703]">{message?.replyMessage?.sender._id === loggedInUserId ? 'You' : message?.replyMessage?.sender.username}</span>
                        <span className="mt-2 min-w-[100px] max-w-[180px] overflow-hidden text-ellipsis">{message?.replyMessage?.content.toString()}</span>
                  </div>
            </div>
      )
}
