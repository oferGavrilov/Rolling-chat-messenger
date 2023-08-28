import { IMessage } from '../../../../../model/message.model'

interface Props {
  message: IMessage
}

export default function TextMessage ({ message }: Props): JSX.Element {
  return <span className={`overflow-hidden break-all pr-3 pl-4 ${message.replyMessage ? 'mb-1' : 'py-1 '}`}>{message.content.toString()}</span>
}
