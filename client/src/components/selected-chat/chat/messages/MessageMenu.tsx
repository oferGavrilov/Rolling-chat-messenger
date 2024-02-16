import { useCallback, useRef, useState } from 'react'
import { useClickOutside } from '../../../../custom-hook/useClickOutside'
import { IMessage, IReplyMessage } from '../../../../model/message.model'
import useStore from '../../../../context/store/useStore'
import { AuthState } from '../../../../context/useAuth'
import { toast } from 'react-toastify'

interface Props {
      message: IMessage
      incomingMessage: boolean
      onRemoveMessage: (message: IMessage, removerId: string) => void
}

export default function MessageMenu({ message, incomingMessage, onRemoveMessage }: Props): JSX.Element {
      const [isOpen, setIsOpen] = useState<boolean>(false)
      const menuRef = useRef<HTMLDivElement>(null)

      const { setReplyMessage } = useStore()
      const { user } = AuthState()

      useClickOutside(menuRef, () => setIsOpen(false), isOpen)

      const onReplyMessage = useCallback((): void => {
            if (message.deletedBy.length > 0) return
            const replyMessage: IReplyMessage = {
                  _id: message._id,
                  sender: message.sender!,
                  content: message.content as string,
                  messageType: message.messageType
            }
            setReplyMessage(replyMessage)
            setIsOpen(false)
      }, [message, setReplyMessage])

      const onCopyToClipboard = useCallback((): void => {
            navigator.clipboard.writeText(message.content as string).then(() => {
                  toast.success('Copied to clipboard', { autoClose: 1500 })
            }).catch(() => {
                  toast.error('Failed to copy to clipboard', { autoClose: 1500 })
            }).finally(() => {
                  setIsOpen(false)
            })
      }, [message.content])

      const removeMessage = useCallback((): void => {
            onRemoveMessage(message, user?._id as string)
            setIsOpen(false)
      }, [message, onRemoveMessage, user?._id])

      return (
            <>
                  <div className={`message-menu-icon ${incomingMessage ? 'right-0 rounded-bl-2xl rounded-tr-3xl rounded-br-md' : 'left-1 rounded-br-2xl rounded-tl-xl'}${isOpen ? 'pointer-events-none' : ''}`} onClick={() => setIsOpen(true)}>
                        <span className="material-symbols-outlined text-sm transition-all duration-150">expand_more</span>
                  </div>

                  <div ref={menuRef} className={`message-menu-container ${incomingMessage ? 'incoming-message' : 'outgoing-message'}`}>
                        <ul className={`message-menu-list ${isOpen ? 'max-h-56' : 'max-h-0  p-0'}`}>
                              {!message?.deletedBy?.length ? (
                                    <>
                                          <li className='message-menu-option rounded-t-lg' onClick={onReplyMessage}>Reply</li>
                                          <li className='message-menu-option'>Forward</li>
                                          <li className='message-menu-option' onClick={onCopyToClipboard}>{message.messageType === 'image' ? 'Copy URL' : 'Copy'}</li>
                                          {message.sender._id === user?._id && <li className='message-menu-option' onClick={removeMessage}>Delete</li>}
                                    </>

                              ) : (
                                    <li className='message-menu-option rounded-lg' onClick={removeMessage}>Delete</li>
                              )}
                        </ul>
                  </div>
            </>
      )
}
