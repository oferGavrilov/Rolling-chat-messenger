import { IMessage } from '../../../../model/message.model'

interface Props {
      message: IMessage
      setSelectedFile: (message: IMessage) => void
}

export default function ImageMessage ({ message, setSelectedFile }: Props) {
      return (
            <img
                  className="max-h-[300px] max-w-[200px] rounded-xl object-cover object-top py-1 cursor-pointer"
                  src={message.content.toString()}
                  alt="conversation-user"
                  onClick={() => setSelectedFile(message)}
            />
      )
}
