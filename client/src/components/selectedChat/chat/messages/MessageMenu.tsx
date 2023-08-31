import { useRef, useState } from 'react'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useClickOutside } from '../../../../custom/useClickOutside'
import { IMessage, IReplyMessage } from '../../../../model/message.model'
import useChat from '../../../../store/useChat'
import { showSuccessMsg } from '../../../../services/event-bus.service'
import { AuthState } from '../../../../context/useAuth'

interface Props {
      message: IMessage
      incomingMessage: boolean
      onRemoveMessage: (message: IMessage, removerId: string) => void
}

export default function MessageMenu ({ message, incomingMessage, onRemoveMessage }: Props): JSX.Element {
      const [isOpen, setIsOpen] = useState<boolean>(false)
      const menuRef = useRef<HTMLDivElement>(null)

      const { setReplyMessage } = useChat()
      const { user } = AuthState()

      useClickOutside(menuRef, () => setIsOpen(false), isOpen)

      function onReplyMessage (): void {
            const replyMessage: IReplyMessage = {
                  _id: message._id,
                  sender: message.sender!,
                  content: message.content as string,
                  messageType: message.messageType
            }
            setReplyMessage(replyMessage)
            setIsOpen(false)
      }

      function onCopyToClipboard (): void {
            navigator.clipboard.writeText(message.content as string)
            setIsOpen(false)
            showSuccessMsg
      }

      function removeMessage (): void {
            onRemoveMessage(message, user?._id as string)
            setIsOpen(false)
      }

      return (
            <>
                  <div className={`message-menu-icon ${incomingMessage ? 'right-1 rounded-bl-2xl' : 'left-1 rounded-br-2xl'} ${isOpen && 'pointer-events-none'}`} onClick={() => setIsOpen(true)}>
                        <KeyboardArrowDownRoundedIcon fontSize="small" />

                  </div>

                  <div ref={menuRef} className={`message-menu-container ${incomingMessage ? 'incoming-message' : 'outgoing-message'}`}>
                        <ul className={`message-menu-list ${isOpen ? 'max-h-56' : 'max-h-0  p-0'}`}>
                              <li className='message-menu-option rounded-t-lg' onClick={onReplyMessage}>Reply</li>
                              <li className='message-menu-option'>Forward</li>
                              <li className='message-menu-option' onClick={onCopyToClipboard}>Copy</li>
                              <li className='message-menu-option' onClick={removeMessage}>Delete</li>
                        </ul>
                  </div>
            </>
      )
}
