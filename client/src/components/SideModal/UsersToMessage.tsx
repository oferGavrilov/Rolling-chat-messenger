import { useEffect, useMemo, useState } from "react"
import { IUser } from "../../model/user.model"
import useChat from "../../store/useChat"
import { userService } from "../../services/user.service"
import { IChat } from "../../model/chat.model"
import CloseIcon from '@mui/icons-material/Close'
import Loading from "../SkeltonLoading"
import UsersInput from "../common/UsersInput"
import UsersList from "./UsersList"

export default function UsersToMessage ({ setIsOpen }): JSX.Element {
      const [filter, setFilter] = useState<string>('')
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [users, setUsers] = useState<IUser[]>([])

      const { setSelectedChat, chats, setChats } = useChat()

      useEffect(() => {
            loadUsers()
      }, [])

      async function loadUsers () {
            setIsLoading(true)
            const users = await userService.getUsers() as IUser[]
            setUsers(users)
            setIsLoading(false)
      }

      const filteredUsers = useMemo(() => {
            if (filter) {
                  return users.filter(user =>
                        user.username.toLowerCase().includes(filter.toLowerCase()) ||
                        user.email.toLowerCase().includes(filter.toLowerCase()))
            }
            return users
      }, [users, filter])

      async function onSelectChat (user: IUser): Promise<void> {
            const data: IChat = await userService.createChat(user._id)

            if (!chats.find(chat => chat._id === data._id)) {
                  setChats([data, ...chats])
            }

            setSelectedChat(data)
            setFilter('')
            setIsOpen(false)
      }

      return (
            <section className="text-secondary-text dark:text-dark-primary-text">
                  <div className='flex justify-between items-center py-4 px-4 shadow-lg shadow-gray-100 dark:shadow-dark-primary-bg'>
                        <h2 className="text-xl">Search Users</h2>
                        <CloseIcon className='cursor-pointer' onClick={() => {
                              setFilter('')
                              setIsOpen(false)
                        }} />
                  </div>

                  <div className='py-6 mx-3 flex relative px-2 gap-x-2'>
                        <UsersInput filter={filter} setFilter={setFilter} placeholder="Filter by name and email" />
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
