import { useRef, useState } from 'react'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useClickOutside } from '../../../../custom/useClickOutside';
import { IMessage, IReplyMessage } from '../../../../model/message.model';
import useChat from '../../../../store/useChat';

interface Props {
      message: IMessage
      incomingMessage: boolean
}

export default function MessageMenu ({ message, incomingMessage }: Props) {
      const [isOpen, setIsOpen] = useState<boolean>(false)
      const menuRef = useRef<HTMLDivElement>(null)

      const { setReplyMessage } = useChat()

      useClickOutside(menuRef, () => setIsOpen(false), isOpen)

      function handleOperation (operation: 'reply' | 'forward' | 'copy' | 'delete') {
            if (operation === 'reply') {
                  const replyMessage: IReplyMessage = {
                        _id: message._id,
                        sender: message.sender!,
                        content: message.content as string,
                        messageType: message.messageType
                  }
                  setReplyMessage(replyMessage)
            }
            setIsOpen(false)
      }

      return (
            <>
                  <div className={`message-menu-icon ${incomingMessage ? 'right-1 rounded-bl-2xl' : 'left-1 rounded-br-2xl'} ${isOpen && 'pointer-events-none'}`} onClick={() => setIsOpen(true)}>
                        <KeyboardArrowDownRoundedIcon fontSize="small" />

                  </div>

                  <div ref={menuRef} className={`message-menu-container ${incomingMessage ? 'incoming-message' : 'outgoing-message'}`}>
                        <ul className={`message-menu-list ${isOpen ? 'max-h-56' : 'max-h-0  p-0'}`}>
                              <li className='message-menu-option rounded-t-lg' onClick={() => handleOperation('reply')}>Reply</li>
                              <li className='message-menu-option'>Forward</li>
                              <li className='message-menu-option'>Copy</li>
                              <li className='message-menu-option'>Delete</li>
                        </ul>
                  </div>
            </>
      )
}
