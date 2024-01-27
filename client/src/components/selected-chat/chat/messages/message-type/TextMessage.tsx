import { IMessage } from '../../../../../model/message.model'

interface Props {
  message: IMessage
}

export default function TextMessage ({ message }: Props): JSX.Element {
  return <span className={`overflow-hidden pr-3 pl-4 ${message.replyMessage ? 'mb-1' : 'py-1'}`} style={{ overflowWrap: 'break-word' }}>{message.content.toString()}</span>
}
