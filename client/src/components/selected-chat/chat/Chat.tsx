import { useEffect, useRef } from 'react'
import useStore from '../../../context/store/useStore'
import { AuthState } from '../../../context/useAuth'
import Messages from './messages/Messages'
import { scrollToBottom, throttle } from '../../../utils/functions'

interface Props {
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "edit-file">>
}

export default function Chat({ setChatMode }: Props): JSX.Element {
      const { messages, setMessages, selectedChat, blobUrls, setBlobUrls } = useStore()
      const { chatBackgroundColor } = AuthState()
      const chatRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (messages.length > 4) {
                  // console.log('scrolling to bottom')
                  setTimeout(() => scrollToBottom(chatRef), 100) // For smooth scrolling
            }
      }, [messages, setMessages])

      useEffect(() => {
            const handleScroll = throttle(() => {
                  const scrollTop = chatRef.current?.scrollTop;
                  if (!scrollTop) return;
                  console.log('scrolling', scrollTop);
                  if (chatRef.current && scrollTop < 30) {
                        console.log('fetching more messages');
                        // fetchMoreMessages();
                  }
            }, 1000);

            const chatElement = chatRef.current;
            if (chatElement) {
                  chatElement.addEventListener('scroll', handleScroll);
            }

            return () => {
                  if (chatElement) {
                        chatElement.removeEventListener('scroll', handleScroll);
                  }
            };
      }, [messages]); 

      useEffect(() => {
            // Revoke blob urls when component unmounts or selected chat id changes
            return () => {
                  if (blobUrls.length === 0) return
                  console.log('revoking blob urls')
                  blobUrls.forEach(blobUrl => URL.revokeObjectURL(blobUrl))
                  setBlobUrls([])
            }
      }, [selectedChat?._id])

      return (
            <>
                  <div className='chat-bg-color' style={{ backgroundColor: chatBackgroundColor.color }}></div>
                  <div className="chat-bg-img" style={{ opacity: chatBackgroundColor.opacity }} />

                  <div
                        className={`overflow-y-auto overflow-x-hidden slide-left h-full bg-no-repeat bg-cover bg-center`}
                        ref={chatRef}
                  >
                        {messages.length > 0 &&
                              <Messages
                                    messages={messages}
                                    setChatMode={setChatMode}
                              />
                        }
                  </div>
            </>
      )
}
