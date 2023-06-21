import { useState } from "react"
import { User } from "../../model/user.model"
import useChat from "../../store/useChat"
import { toast } from "react-toastify"
import { userService } from "../../services/user.service"
import { IChat } from "../../model/chat.model"
import { Button, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import Loading from "../Loading"



export default function UsersToMessage ({ setIsOpen }) {
      const [search, setSearch] = useState<string>('')
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [users, setUsers] = useState<User[]>([])

      const { setSelectedChat, chats, setChats } = useChat()

      function handleKeyPress (e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                  handleSearch()
            }
      }

      async function handleSearch (): Promise<void | number | string> {
            // For Clear the users search result
            if (!search && users.length > 0) {
                  return clearSearch()
            }

            if (!search) return toast.error('Please enter a name or email')
            setIsLoading(true)
            const data = await userService.searchUsers(search)
            setUsers(data)
            setIsLoading(false)
      }

      async function onSelectChat (userId: string): Promise<void> {
            const data: IChat = await userService.createChat(userId);
            if (!chats.find(chat => chat._id !== data._id)) {
                  setChats([data, ...chats])
            }

            setSelectedChat(data);
            clearSearch();
            setIsOpen(false);
      }


      function clearSearch (): void {
            setSearch('')
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
                  <div className='py-6 px-4 flex gap-x-2 relative'>
                        <input type="text" autoFocus className="w-full  h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Search by name or email" value={search} onKeyUp={handleKeyPress} onChange={(e) => setSearch(e.target.value)} />
                        <Button color='inherit' style={{ background: '#27AE60', color: 'white' }} onClick={handleSearch} className="!px-4 !py-2 !rounded-lg hover:!bg-[#52796f]">{isLoading ? <div className='spinner'></div> : 'Search'}</Button>
                        {search && <CloseIcon className='cursor-pointer absolute right-28 top-9' color='disabled' fontSize="medium" onClick={clearSearch} />}
                  </div>

                  <div className='border-t '>
                        {isLoading && <Loading type="users" />}
                        {(users.length > 0 && !isLoading) && (
                              <ul className='flex flex-col main-text px-8 gap-y-4 py-8'>
                                    {users.map((user: User) => (
                                          <li key={user._id} onClick={() => onSelectChat(user._id)} className='custom-hover text-main-color py-2 px-4 rounded-lg bg-[#dee2e6]'>
                                                <div className='flex gap-x-4 items-center'>
                                                      <img className='w-12 h-12 object-cover rounded-full' src={user.profileImg || "imgs/guest.jpg"} alt="" />
                                                      <div>
                                                            <span className='text-xl'>{user.username}</span>
                                                            <p className='cut-text text-lg max-w-[270px]'>
                                                                  <span className='font-bold'>Email: </span>
                                                                  {user.email}</p>
                                                      </div>
                                                </div>
                                          </li>
                                    ))}
                              </ul>)
                        }
                        {(users.length <= 0 && !isLoading) && <img className='mx-auto py-8 w-40 opacity-80' loading='eager' src="gifs/search.gif" alt="" />}
                  </div>
            </Typography>
      )
}