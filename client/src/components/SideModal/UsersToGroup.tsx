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
import UsersList from './UsersList'

interface Props {
      setIsOpen: CallableFunction
}

export default function UsersToGroup ({ setIsOpen }: Props) {
      const [filter, setFilter] = useState<string>('')
      const [users, setUsers] = useState<IUser[]>([])
      const [group, setGroup] = useState<{ chatName: string, users: IUser[] }>({ chatName: '', users: [] })
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [image, setImage] = useState<string>('')
      const { user } = AuthState()

      const { chats, setChats } = useChat()

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
                  setGroup({ chatName: '', users: [] })
                  
                  const socket = io(process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000', { transports: ['websocket'] })
                  socket.emit('create group', group.users, user?._id, newChat)
            } catch (error) {
                  console.error("An error occurred while creating group:", error)
            }
      }

      function handleGroupUsers (user: IUser) {
            if (group.users.find(u => u._id === user._id)) {
                  return setGroup({ ...group, users: group.users.filter(u => u._id !== user._id) })
            }

            setGroup({ ...group, users: [...group.users, user] })
      }

      function clearSelectedUsers (): void {
            setGroup({ ...group, users: [] })
      }

      return (
            <div className="py-6 w-screen max-w-[435px] text-secondary-text dark:text-dark-primary-text">
                  <h2 className='text-xl md:text-2xl text-center pb-5 dark:text-dark-primary-text'>Create Group Chat</h2>

                  <div className='flex flex-col gap-y-6 px-4 mx-auto'>
                        <UploadImage image={image} setImage={setImage} />
                        <input
                              type="text"
                              className='bg-gray-100 p-2 py-3 rounded-lg px-3 dark:text-black focus:outline-none focus:ring-2 focus:ring-primary'
                              value={group.chatName}
                              onChange={(e) => setGroup({ ...group, chatName: e.target.value })}
                              placeholder="Group Name*"
                        />
                        <div className='flex relative'>
                              <UsersInput filter={filter} setFilter={setFilter} placeholder="Filter by name and email" />
                        </div>
                        <button
                              onClick={onCreateGroup}
                              className='create-group-btn'>
                              Create Chat
                        </button>
                  </div>

                  {(!isLoading) ? (
                        <UsersList
                              users={filteredUsers}
                              onSelectChat={handleGroupUsers}
                              selectedUsers={group.users}
                              clearSelectedUsers={clearSelectedUsers}
                              usersType="group"
                        />
                  ) : (
                        <Loading type="users" />
                  )}

                  <CloseIcon className='cursor-pointer dark:text-dark-primary-text absolute right-4 top-6' color='disabled' fontSize="large" onClick={() => setIsOpen(false)} />
            </div>
      )
}