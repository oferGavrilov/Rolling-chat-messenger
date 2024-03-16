import { useState, useMemo, useEffect, useRef } from 'react'
import { chatService } from '../../../services/chat.service'
import useStore from '../../../context/store/useStore'
import ChatLoading from '../../SkeltonLoading'
import MessagesInput from '../../common/MessagesInput'
import { AuthState } from '../../../context/useAuth'
import { IUser } from '../../../model/user.model'
import { IChat } from '../../../model/chat.model'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useClickOutside } from '../../../custom-hook/useClickOutside'
import socketService from '../../../services/socket.service'
import { ContentType } from '../../../pages/ChatPage'
import ChatList from './ChatList'
import { IMessage } from '../../../model'

interface MessagesProps {
      contentType: ContentType
}

export default function Chats({ contentType }: MessagesProps): JSX.Element {
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [filter, setFilter] = useState<string>('')
      const [sort, setSort] = useState<'Newest' | 'Oldest' | null>(null)
      const [showSortModal, setShowSortModal] = useState<boolean>(false)

      const { chats, setChats, updateChatsWithNewMessage, updateChatStatusToRead } = useStore()
      const { user: loggedinUser } = AuthState()

      const modalRef = useRef<HTMLUListElement>(null)

      useClickOutside(modalRef, () => setShowSortModal(false), showSortModal)

      useEffect(() => {
            if (!loggedinUser) return
            socketService.setup(loggedinUser._id)
            socketService.on('user-kicked', () => loadChats('user-kicked'))
            socketService.on('user-joined', () => loadChats('user-joined'))
            socketService.on('user-left', () => loadChats('user-left'))

            async function loadChats(event?: string): Promise<void> {
                  if (!loggedinUser) return

                  // for handling user-joined and user-left events when user is kicked/left and joined back
                  if (event === 'user-joined') {
                        socketService.emit('join-user', loggedinUser?._id)
                  } else if (event === 'user-left' || event === 'user-kicked') {
                        socketService.emit('leave-user', loggedinUser?._id)
                  }

                  try {
                        setIsLoading(true)
                        let chats = await chatService.getUserChats()
                        setChats(chats)
                  } catch (err) {
                        console.log(err)
                  } finally {
                        setIsLoading(false)
                  }
            }

            loadChats()

            return () => {
                  socketService.off('user-kicked')
                  socketService.off('user-joined')
                  socketService.off('user-left')
            }
      }, [])

      const filteredChats = useMemo(() => {
            if (filter) {
                  const filterRegex = new RegExp(filter, 'i')

                  return chats.filter((chat: IChat) => {
                        const includesUsername = chat.users?.some((user: IUser) => user._id !== loggedinUser?._id && filterRegex.test(user.username))
                        const includesGroupName = filterRegex.test(chat.chatName || '')

                        return includesUsername || includesGroupName
                  })
            }
            if (contentType === 'groups') {
                  return chats.filter((chat: IChat) => chat.isGroupChat)
            }
            if (sort) {
                  if (sort === 'Newest') {
                        return chats.sort((a: IChat, b: IChat) => new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime())
                  } else if (sort === 'Oldest') {
                        return chats.sort((a: IChat, b: IChat) => new Date(a.updatedAt as string).getTime() - new Date(b.updatedAt as string).getTime())
                  }
            }
            return chats
      }, [chats, filter, contentType, loggedinUser, sort, setChats])

      useEffect(() => {
            socketService.on('notification', (newMessage: IMessage) => updateChatsWithNewMessage(newMessage))

            // update the chat latest message as read
            socketService.on('message-read', ({ chatId, userId }: { chatId: string, userId: string }) => {
                  updateChatStatusToRead(chatId, userId);
            })

            return () => {
                  socketService.off('notification');
                  socketService.off('message-read');
            }
      }, [updateChatsWithNewMessage, updateChatStatusToRead]);

      function onSetSort(type: 'Newest' | 'Oldest' | null): void {
            setSort(type)
            setShowSortModal(false)
      }

      return (
            <div className="pt-4 relative h-full">
                  <MessagesInput filter={filter} setFilter={setFilter} />

                  <div className='p-2 mx-4 text-sm lg:text-md flex'>
                        Sort by
                        <div className='px-2 relative'>
                              <span className={'flex items-center text-primary font-semibold cursor-pointer hover:underline' + `${showSortModal ? 'pointer-events-none' : ''}`} onClick={() => setShowSortModal((prev) => !prev)}>
                                    {!sort ? 'None' : sort}
                                    <KeyboardArrowUpRoundedIcon fontSize='small' className={`!transition-transform duration-700 ${showSortModal ? 'rotate-180' : ''} `} />
                              </span>

                              <ul
                                    ref={modalRef}
                                    className={`sort-list ${showSortModal ? 'w-auto max-h-[300px]' : 'max-h-0 py-0'}`}
                              >
                                    <li className={`sort-option  ${sort === 'Newest' ? 'sort-option-active' : ''}`} onClick={() => onSetSort('Newest')}>Newest</li>
                                    <li className={`sort-option border-y dark:border-white ${sort === 'Oldest' ? 'sort-option-active' : ''}`} onClick={() => onSetSort('Oldest')}>Oldest</li>
                                    <li className={`sort-option ${!sort ? 'sort-option-active' : ''}`} onClick={() => onSetSort(null)}>None</li>
                              </ul>
                        </div>
                  </div>

                  {!isLoading ? (
                        filteredChats.length > 0 ? (
                              <ChatList chats={filteredChats} />
                        ) : (
                              <>
                                    <center>no chats</center>
                              </>
                        )
                  ) : (
                        <ChatLoading type="chats" />
                  )}
            </div>
      )
}
