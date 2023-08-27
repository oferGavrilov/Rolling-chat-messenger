import { IMessage } from '../../../../../model/message.model'

interface Props {
      message: IMessage
      setSelectedFile: (message: IMessage) => void
}

export default function FileMessage ({ message, setSelectedFile }: Props): JSX.Element {
      
      return (
            <div className="relative">
                  <iframe
                        src={message.content.toString()}
                        title={message.content.toString()}
                        className="h-[300px] w-[200px] pointer-events-none overflow-hidden rounded-lg"
                  ></iframe>
                  <div
                        className="h-[300px] w-[200px] absolute top-0 left-0 cursor-pointer"
                        onClick={() => setSelectedFile(message)}
                  ></div>
            </div>
      )
}
