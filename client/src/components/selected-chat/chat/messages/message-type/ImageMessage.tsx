import { IMessage } from '../../../../../model/message.model'

interface Props {
      message: IMessage
      setSelectedFile: (message: IMessage) => void
      userId: string
}

export default function ImageMessage ({ message, setSelectedFile, userId }: Props) {
      return (
            <div>
                  {(message.chat?.isGroupChat && message.sender._id !== userId) && (
                        <span className='mx-2 font-bold text-orange-400 leading-4 lowercase'>{message.sender.username}</span>
                  )}

                  <img
                        className="max-h-[300px] max-w-[200px] rounded-2xl object-cover object-top py-1 cursor-pointer px-2"
                        src={message.content.toString()}
                        loading='lazy'
                        alt="conversation-user"
                        onClick={() => setSelectedFile(message)}
                  />
            </div>
      )
}
