import CloseIcon from '@mui/icons-material/Close'
import { debounce } from "../../utils/functions"
import { userService } from "../../services/user.service"
import { useState } from "react"
import { User } from "../../model/user.model"
import Loading from "../Loading"
import { toast } from 'react-toastify'
import { chatService } from '../../services/chat.service'
import useChat from '../../store/useChat'
import UploadImage from '../UploadImage'


interface Props {
      setIsOpen: CallableFunction
      mode?: string
}

export default function UsersToGroup ({ setIsOpen, mode }: Props) {
      const [search, setSearch] = useState<string>('')
      const [searchResult, setSearchResult] = useState<User[]>([])
      const [group, setGroup] = useState({ chatName: '', users: [] })
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [image, setImage] = useState<string>('')

      const { chats, setChats } = useChat()

      async function onCreateGroup () {
            if (!group.chatName) return toast.error('Please enter a group name')
            if (group.users.length === 0) return toast.error('Please select at least one user')
            try {
                  const groupToAdd = { ...group, groupImage: image }
                  const newChat = await chatService.createGroup(groupToAdd)
                  setChats([newChat, ...chats])
                  toast.success('Group created successfully')
                  setIsOpen(false)
            } catch (error) {
                  console.error("An error occurred while creating group:", error)
            }
      }

      async function handleSearch (e: React.ChangeEvent<HTMLInputElement>) {
            setSearch(e.target.value)
            if (!search) return
            setIsLoading(true)
            const debouncedSearch = debounce(async (search: string) => {
                  try {
                        const data = await userService.searchUsers(search)
                        setSearchResult(data)
                  } catch (error) {
                        console.error("An error occurred while searching:", error)
                  } finally {
                        setIsLoading(false)
                  }
            })
            debouncedSearch(search)
      }

      function handleGroup (user: User) {
            if (group.users.find(u => u._id === user._id)) {
                  return setGroup({ ...group, users: group.users.filter(u => u._id !== user._id) })
            }

            setGroup({ ...group, users: [...group.users, user] })
      }
      function removeFromGroup (userId: string) {
            setGroup({ ...group, users: group.users.filter(u => u._id !== userId) })
      }

      return (
            <div className="p-6">
                  {mode === 'create' &&
                        <>
                              <h2 className='text-2xl text-center pb-5'>Create Group Chat</h2>

                              <div className='flex flex-col gap-y-6'>
                                    <UploadImage image={image} setImage={setImage} />
                                    <input
                                          type="text"
                                          className='bg-gray-100 p-2 rounded-lg border-2 border-gray-100 focus:border-blue-400'
                                          value={group.chatName}
                                          onChange={(e) => setGroup({ ...group, chatName: e.target.value })}
                                          placeholder="Group Name"
                                    />
                                    <input type="text"
                                          className='bg-gray-100 p-2 rounded-lg border-2 border-gray-100 focus:border-blue-400'
                                          value={search}
                                          onChange={handleSearch}
                                          placeholder="Search users to Add"
                                    />
                                    <button onClick={onCreateGroup} className='self-end  mt-2 p-2 transition-colors duration-200 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>Create Chat</button>
                              </div>
                        </>
                  }

                  {group.users.length > 0 && (
                        <div className="flex py-4">
                              {group.users.map((user) => (
                                    <div key={user._id} className='relative p-2 [&>*]:hover:!block'>
                                          <img src={user.profileImg} alt="selected-user" className="h-11 w-11 rounded-full border-2 border-green-400" />
                                          <CloseIcon onClick={() => removeFromGroup(user._id)} className='absolute cursor-pointer top-0 right-0 !hidden bg-red-500 !text-base rounded-xl text-white' />
                                    </div>
                              ))}
                        </div>
                  )}

                  {(!isLoading && search) && (
                        <ul className='flex flex-col main-text px-4 gap-y-4 py-8'>
                              {searchResult.map((user: User) => (
                                    <li key={user._id} className='text-main-color py-2 px-4 rounded-lg bg-gray-100 transition-colors duration-200 cursor-pointer hover:bg-gray-200'>
                                          <div className='flex gap-x-4 items-center' onClick={() => handleGroup(user)}>
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
                        </ul>)}
                  {(isLoading && search) && <Loading type="users" />}
            </div>
      )
}