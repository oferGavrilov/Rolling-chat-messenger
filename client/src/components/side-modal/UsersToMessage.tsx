import { useEffect, useMemo, useState } from "react"
import { IUser } from "../../model/user.model"
import useChat from "../../context/useChat"
import { userService } from "../../services/user.service"
import Loading from "../SkeltonLoading"
import SearchInput from "../common/SearchInput"
import UsersList from "./UsersList"
import { AuthState } from "../../context/useAuth"
import { IChat } from "../../model/chat.model"

interface Props {
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      isOpen: boolean
}

export default function UsersToMessage({ setIsOpen, isOpen }: Props): JSX.Element {
      const [filter, setFilter] = useState<string>('')
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [users, setUsers] = useState<IUser[]>([])

      const { setSelectedChat, chats } = useChat()
      const { user: loggedInUser } = AuthState()

      useEffect(() => {
            if (isOpen) {
                  loadUsers()
            }
      }, [isOpen])

      async function loadUsers(): Promise<void> {
            try {
                  setIsLoading(true)
                  const users = await userService.getUsers()
                  setUsers(users)
                  setIsLoading(false)

            } catch (error) {
                  console.error("An error occurred while loading users:", error)
                  setIsLoading(false)
            }
      }

      const filteredUsers = useMemo(() => {
            if (filter) {
                  return users.filter(user =>
                        user.username.toLowerCase().includes(filter.toLowerCase()) ||
                        user.email.toLowerCase().includes(filter.toLowerCase()))
            }
            return users
      }, [users, filter])

      async function onSelectChat(user: IUser): Promise<void> {
            // Check if chat already exists and its not a group chat
            let chat: IChat | undefined

            if (chats) {
                  chat = chats.find((chat) => !chat?.isGroupChat && chat?.users.some((chatUser) => chatUser._id === user._id))
            }

            if (chat) {
                  setSelectedChat(chat)
                  setFilter('')
                  setIsOpen(false)
                  return
            }

            setSelectedChat(null)

            const newChat = {
                  _id: 'temp-id',
                  chatName: user.username,
                  groupImage: user.profileImg,
                  isGroupChat: false,
                  users: [user, loggedInUser] as IUser[],
                  messages: [],
                  kickedUsers: [],
                  unreadMessagesCount: 0
            }

            setSelectedChat(newChat)
            setFilter('')
            setIsOpen(false)
      }

      return (
            <section className="py-6 text-secondary-text dark:text-dark-primary-text">
                  <h2 className='text-xl md:text-2xl text-center pb-5 dark:text-dark-primary-text'>Create Group Chat</h2>


                  <div className='py-6 mx-3 flex relative px-2 gap-x-2'>
                        <SearchInput filter={filter} setFilter={setFilter} placeholder="Filter by name or email..." />
                  </div>

                  <div className={`${users.length && 'border-t-2 dark:border-gray-500'}`}>
                        {isLoading && <Loading type="users" />}
                        {(filteredUsers.length > 0 && !isLoading) && (
                              <UsersList users={filteredUsers} onSelectChat={onSelectChat} usersType="message" />)
                        }
                  </div>
            </section>
      )
}
