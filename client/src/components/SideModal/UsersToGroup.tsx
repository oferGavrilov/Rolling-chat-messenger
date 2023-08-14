import CloseIcon from '@mui/icons-material/Close'
import { userService } from "../../services/user.service"
import { useEffect, useMemo, useState } from "react"
import { IUser } from "../../model/user.model"
import Loading from "../SkeltonLoading"
import { toast } from 'react-toastify'
import { chatService } from '../../services/chat.service'
import useChat from '../../store/useChat'
import UploadImage from '../UploadImage'
import UsersInput from '../common/UsersInput'
import { io } from 'socket.io-client'
import { AuthState } from '../../context/useAuth'
import { IChat } from '../../model/chat.model'

interface Props {
      setIsOpen: CallableFunction
      isAddNewGroup?: boolean
      groupToEdit?: IChat
}

export default function UsersToGroup ({ setIsOpen, isAddNewGroup = false, groupToEdit }: Props) {
      const [filter, setFilter] = useState<string>('')
      const [users, setUsers] = useState<IUser[]>([])
      const [group, setGroup] = useState({ chatName: groupToEdit?.chatName || '', users: groupToEdit?.users || [] })
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [image, setImage] = useState<string>(groupToEdit?.groupImage || '')
      const { user } = AuthState()

      const { chats, setChats, selectedChat, setSelectedChat } = useChat()

      useEffect(() => {
            loadUsers()
      }, [])

      async function loadUsers () {
            try {
                  setIsLoading(true)
                  const users = await userService.getUsers() as IUser[]
                  setUsers(users)
            } catch (err) {
                  console.error("An error occurred while loading users:", err)
            } finally {
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

      async function onCreateGroup () {
            if (!group.chatName) return toast.error('Please enter a group name')
            if (group.users.length === 0) return toast.error('Please select at least one user')
            try {
                  const groupToAdd = { ...group, groupImage: image }
                  const newChat = await chatService.createGroup(groupToAdd)
                  setChats([newChat, ...chats])
                  toast.success('Group created successfully')
                  setIsOpen(false)

                  const socket = io(process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000', { transports: ['websocket'] })
                  socket.emit('create group', group.users, user?._id, newChat)
            } catch (error) {
                  console.error("An error occurred while creating group:", error)
            }
      }

      async function onAddUsers () {
            if (group.users.length === 0) return toast.error('Please select at least one user')
            if (!groupToEdit) return toast.error('An error occurred while updating group')

            try {
                  const data = await chatService.updateUsersGroup(groupToEdit._id, group.users)
                  setChats(chats.map(chat => chat._id === groupToEdit._id ? { ...chat, users: data.users } : chat))
                  if (selectedChat) {
                        setSelectedChat({ ...selectedChat, users: data.users })
                  }
                  toast.success('Group updated successfully')
                  setIsOpen(false)
            } catch (error) {
                  console.error("An error occurred while updating group:", error)
            }
      }

      function handleGroupUsers (user: IUser) {
            if (group.users.find(u => u._id === user._id)) {
                  return setGroup({ ...group, users: group.users.filter(u => u._id !== user._id) })
            }

            setGroup({ ...group, users: [...group.users, user] })
      }

      function removeFromGroup (userId: string): void {
            setGroup({ ...group, users: group.users.filter(u => u._id !== userId) })
      }

      return (
            <div className="py-6 w-screen max-w-[435px]">
                  <h2 className='text-2xl text-center pb-5 dark:text-dark-primary-text'>{isAddNewGroup ? 'Create Group Chat' : 'Edit Group Chat'}</h2>

                  <div className='flex flex-col gap-y-6 px-4 mx-auto'>
                        {isAddNewGroup && <>
                              <UploadImage image={image} setImage={setImage} />
                              <input
                                    type="text"
                                    className='bg-gray-100 p-2 py-3 rounded-lg px-3 focus:ring-blue-400 dark:focus:ring-dark-primary-bg'
                                    value={group.chatName}
                                    onChange={(e) => setGroup({ ...group, chatName: e.target.value })}
                                    placeholder="Group Name"
                              />
                        </>
                        }
                        <div className='py-6 flex relative px-2 '>
                              <UsersInput filter={filter} setFilter={setFilter} placeholder="Filter by name and email" />
                        </div>
                        <button
                              onClick={isAddNewGroup ? onCreateGroup : onAddUsers}
                              className='self-end mt-2 p-2 transition-colors duration-200 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                              dark:bg-dark-primary-bg dark:hover:bg-dark-tertiary-bg'>
                              {isAddNewGroup ? 'Create Chat' : 'Edit Chat'}
                        </button>
                  </div>

                  {group.users.length > 0 && (
                        <div className="flex p-4">
                              {group.users.map((user: IUser) => (
                                    <div key={user._id} className='relative p-2 [&>*]:hover:!block'>
                                          <img src={user.profileImg} alt="selected-user" className="h-11 w-11 rounded-full border-2 border-primary object-cover object-top" />
                                          <CloseIcon onClick={() => removeFromGroup(user._id)} className='absolute cursor-pointer top-0 right-0 !hidden bg-red-500 !text-base rounded-xl text-white' />
                                    </div>
                              ))}
                        </div>
                  )}

                  {(!isLoading) ? (
                        <ul className='flex flex-col main-text px-4 gap-y-4 py-8'>
                              {filteredUsers.map((user: IUser) => (
                                    <li key={user._id} className='text-main-color py-2 px-4 rounded-lg bg-gray-100 transition-colors duration-200 cursor-pointer hover:bg-gray-200'>
                                          <div className='flex gap-x-4 items-center' onClick={() => handleGroupUsers(user)}>
                                                <img className='w-12 h-12 object-cover object-top rounded-full' src={user.profileImg || "imgs/guest.jpg"} alt="" />
                                                <div>
                                                      <span className='text-xl'>{user.username}</span>
                                                      <p className='ellipsis-text text-lg max-w-[270px]'>
                                                            <span className='font-bold'>Email: </span>
                                                            {user.email}</p>
                                                </div>
                                          </div>
                                    </li>
                              ))}
                        </ul>) : (
                        <Loading type="users" />
                  )}

                  <CloseIcon className='cursor-pointer dark:text-dark-primary-text absolute right-4 top-6' color='disabled' fontSize="large" onClick={() => setIsOpen(false)} />
            </div>
      )
}