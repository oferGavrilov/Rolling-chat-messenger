import { useEffect, useMemo, useState } from "react"
import { IUser } from "../../model/user.model"
import useChat from "../../store/useChat"
import { userService } from "../../services/user.service"
import { IChat } from "../../model/chat.model"
import { Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import Loading from "../SkeltonLoading"
import UsersInput from "../common/UsersInput"

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

      async function onSelectChat (userId: string): Promise<void> {
            const data: IChat = await userService.createChat(userId)

            if (!chats.find(chat => chat._id === data._id)) {
                  setChats([data, ...chats])
            }

            setSelectedChat(data)
            setFilter('')
            setIsOpen(false)
      }



      return (
            <Typography variant="h6" component='div' className="relative">
                  <div className='flex justify-between items-center py-4 px-4 shadow-lg shadow-gray-100 dark:shadow-dark-primary-bg'>
                        <h2 className="dark:text-dark-primary-text">Search Users</h2>
                        <CloseIcon className='cursor-pointer dark:text-dark-primary-text' fontSize="medium" onClick={() => {
                              setFilter('')
                              setIsOpen(false)
                        }} />
                  </div>

                  <div className='py-6 mx-3 flex relative px-2 gap-x-2'>
                        <UsersInput filter={filter} setFilter={setFilter} placeholder="Filter by name and email" />
                  </div>

                  <div className={`${users.length && 'border-t'}`}>
                        {isLoading && <Loading type="users" />}
                        {(filteredUsers.length > 0 && !isLoading) && (
                              <ul className='flex flex-col main-text px-4 md:px-8 gap-y-4 py-8 calc-height overflow-auto'>
                                    {filteredUsers.map((user: IUser) => (
                                          <li key={user._id} onClick={() => onSelectChat(user._id)} className='text-main-color cursor-pointer dark:text-dark-primary-text dark:bg-dark-tertiary-bg py-2 px-4 rounded-lg bg-white'>
                                                <div className='flex gap-x-4 items-center'>
                                                      <img className='w-10 h-10 md:w-12 md:h-12 object-cover object-top rounded-full' src={user.profileImg || "imgs/guest.jpg"} alt="" />
                                                      <div>
                                                            <span className='md:text-xl font-semibold'>{user.username}</span>
                                                            <p className='ellipsis-text text-lg max-w-[270px]'>
                                                                  <span className='font-bold'>Email: </span>
                                                                  {user.email}</p>
                                                      </div>
                                                </div>
                                          </li>
                                    ))}
                              </ul>)
                        }
                        {(filteredUsers.length <= 0 && !isLoading) && <img className='mx-auto py-8 w-40 opacity-80' loading='eager' src="gifs/search.gif" alt="" />}
                  </div>
            </Typography>
      )
}
