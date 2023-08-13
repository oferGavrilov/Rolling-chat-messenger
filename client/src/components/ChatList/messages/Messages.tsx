import MessageList from './MessageList'
import { useState, useMemo, useEffect, useRef } from 'react'
import { chatService } from '../../../services/chat.service'
import useChat from '../../../store/useChat'
import ChatLoading from '../../SkeltonLoading'
import MessagesInput from '../../common/MessagesInput'
import { userService } from '../../../services/user.service'
import { AuthState } from '../../../context/useAuth'
import { IUser } from '../../../model/user.model'
import { IChat } from '../../../model/chat.model'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { useClickOutside } from '../../../custom/useClickOutside'

interface MessagesProps {
      contentType: string
}

export default function Messages ({ contentType }: MessagesProps) {

      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [filter, setFilter] = useState<string>('')
      const [sort, setSort] = useState<string>('Newest')
      const [showSortModal, setShowSortModal] = useState<boolean>(false)


      const { chats, setChats } = useChat()
      const { user: loggedinUser } = AuthState()

      const modalRef = useRef<HTMLUListElement>(null)

      useClickOutside(modalRef, () => setShowSortModal(false), showSortModal)

      const filteredChats = useMemo(() => {
            if (filter) {
                  return chats.filter((chat: IChat) =>
                        chat.users.some((user: IUser) => user._id !== loggedinUser?._id && user.username.toLowerCase().includes(filter.toLowerCase()))
                  )
            }
            if (contentType === 'groups') {
                  return chats.filter((chat: IChat) => chat.isGroupChat)
            }
            if (sort) {
                  if (sort === 'Newest') {
                        return chats.sort((a: IChat, b: IChat) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  }
                  return chats.sort((a: IChat, b: IChat) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
            }
            return chats
      }, [chats, filter, contentType, loggedinUser, sort])

      useEffect(() => {
            async function loadChats (): Promise<void> {
                  setIsLoading(true)
                  const user = await userService.getLoggedinUser()
                  if (!user) return
                  const chats = await chatService.getUserChats(user._id)
                  setChats(chats)
                  setIsLoading(false)
            }

            loadChats()
      }, [setChats])

      function onSetSort (type: string) {
            setSort(type)
            setShowSortModal(false)
      }

      return (
            <div className="pt-4 relative">
                  <MessagesInput filter={filter} setFilter={setFilter} />

                  <div className='p-3 mx-4 flex'>
                        Sort by
                        <div className='px-2 relative'>
                              <span className={`flex items-center text-primary dark:text-dark-tertiary-text font-semibold cursor-pointer hover:underline ${showSortModal && 'pointer-events-none'}`} onClick={() => setShowSortModal((prev) => !prev)}>
                                    {sort}
                                    <KeyboardArrowUpRoundedIcon fontSize='small' className={`!transition-transform duration-700 ${showSortModal ? 'rotate-180' : ''} `} />
                              </span>

                              <ul
                                    ref={modalRef}
                                    className={`absolute text-center left-3 z-10 top-6 overflow-hidden transition-all duration-300 bg-gray-400 text-white rounded-md 
                               ${showSortModal ? 'w-auto max-h-[300px]' : 'max-h-0 py-0'}`}
                              >
                                    <li className={`sort-option border-b border-white ${sort === 'Newest' && 'bg-secondary dark:bg-dark-tertiary-bg hover:bg-primary'}`} onClick={() => onSetSort('Newest')}>Newest</li>
                                    <li className={`sort-option ${sort === 'Oldest' && 'bg-secondary dark:bg-dark-tertiary-bg hover:bg-primary'}`} onClick={() => onSetSort('Oldest')}>Oldest</li>
                              </ul>
                        </div>
                  </div>

                  {!isLoading ? (
                        <MessageList chats={filteredChats} />) : (
                        <ChatLoading type="chats" />)}
            </div>
      )
}
