import { useEffect, useMemo, useState } from "react"
import { User } from "../../model/user.model"
import useChat from "../../store/useChat"
import { userService } from "../../services/user.service"
import { IChat } from "../../model/chat.model"
import { Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import Loading from "../Loading"

export default function UsersToMessage ({ setIsOpen }) {
      const [filter, setFilter] = useState<string>('')
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [users, setUsers] = useState<User[]>([])

      const { setSelectedChat, chats, setChats } = useChat()

      useEffect(() => {
            loadUsers()
      }, [])

      async function loadUsers () {
            setIsLoading(true)
            const users = await userService.getUsers()
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
            clearSearch()
            setIsOpen(false)
      }


      function clearSearch (): void {
            setFilter('')
            setUsers([])
      }
      return (
            <Typography variant="h6" component='div' className="relative">
                  <div className='flex justify-between items-center py-4 px-4 shadow-sm shadow-secondary'>
                        <h2 className="">Search Users</h2>
                        <CloseIcon className='cursor-pointer' fontSize="medium" onClick={() => {
                              clearSearch()
                              setIsOpen(false)
                        }} />
                  </div>
                  <div className='py-6  flex relative px-2 gap-x-2'>
                        <input
                              type="text"
                              autoFocus
                              className="w-full h-10 md:h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6294f1] focus:border-transparent"
                              placeholder="Filter by name or email"
                              value={filter}
                              onChange={(e) => setFilter(e.target.value)}
                        />
                        {filter &&
                              <CloseIcon className='cursor-pointer absolute right-4 top-8' color='disabled' fontSize="medium" onClick={clearSearch} />}
                  </div>

                  <div className={`${users.length && 'border-t'}`}>
                        {isLoading && <Loading type="users" />}
                        {(filteredUsers.length > 0 && !isLoading) && (
                              <ul className='flex flex-col main-text px-4 md:px-8 gap-y-4 py-8'>
                                    {filteredUsers.map((user: User) => (
                                          <li key={user._id} onClick={() => onSelectChat(user._id)} className='custom-hover text-main-color py-2 px-4 rounded-lg bg-[#dee2e6]'>
                                                <div className='flex gap-x-4 items-center'>
                                                      <img className='w-10 h-10 md:w-12 md:h-12 object-cover object-top rounded-full' src={user.profileImg || "imgs/guest.jpg"} alt="" />
                                                      <div>
                                                            <span className='md:text-xl'>{user.username}</span>
                                                            <p className='cut-text text-lg max-w-[270px]'>
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
