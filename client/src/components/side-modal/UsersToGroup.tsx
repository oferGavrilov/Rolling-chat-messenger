import React, { useEffect, useMemo, useState } from "react"
import { userService } from "../../services/user.service"
import { chatService } from '../../services/chat.service'
import { AuthState } from '../../context/useAuth'
import useChat from '../../context/useChat'
import Loading from "../SkeltonLoading"
import { IUser } from "../../model/user.model"
import { toast } from 'react-toastify'

import UploadImage from '../UploadImage'
import SearchInput from '../common/SearchInput'
import UsersList from './UsersList'
import socketService from "../../services/socket.service"

interface Props {
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      isOpen: boolean
}

export default function UsersToGroup({ setIsOpen, isOpen }: Props) {
      const [filter, setFilter] = useState<string>('')
      const [users, setUsers] = useState<IUser[]>([])
      const [group, setGroup] = useState<{ chatName: string, users: IUser[] }>({ chatName: '', users: [] })
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [image, setImage] = useState<string>('')
      const { user } = AuthState()

      const { chats, setChats } = useChat()

      useEffect(() => {
            if (isOpen) {
                  loadUsers()
            }
      }, [isOpen])

      async function loadUsers() {
            try {
                  setIsLoading(true)
                  const users = await userService.getUsers() as IUser[]
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

      async function onCreateGroup(): Promise<void> {
            if (!group.chatName) {
                  toast.error('Please enter a group name')
                  return
            }

            if (group.users.length === 0) {
                  toast.error('Please select at least one user')
                  return
            }

            try {
                  const groupToAdd = { ...group, groupImage: image }
                  const newChat = await chatService.createGroup(groupToAdd)
                  setChats([newChat, ...chats])
                  toast.success('Group created successfully')
                  setIsOpen(false)
                  setGroup({ chatName: '', users: [] })

                  // const socket = io(process.env.NODE_ENV === 'production' ? 'https://rolling-948m.onrender.com/' : 'http://localhost:5000', { transports: ['websocket'] })
                  // socket.emit('create group', group.users, user?._id, newChat)
                  socketService.emit('create group', { users: group.users, adminId: user?._id, group: newChat })
            } catch (error) {
                  console.error("An error occurred while creating group:", error)
            }
      }

      function handleGroupUsers(user: IUser): void {
            if (group.users.find(u => u._id === user._id)) {
                  setGroup({ ...group, users: group.users.filter(u => u._id !== user._id) })
                  return
            }

            setGroup({ ...group, users: [...group.users, user] })
      }

      function clearSelectedUsers(): void {
            setGroup({ ...group, users: [] })
      }

      return (
            <div className="py-6 w-screen max-w-[435px] text-secondary-text dark:text-dark-primary-text">
                  <h2 className='text-xl md:text-2xl text-center pb-5 dark:text-dark-primary-text'>Create Group Chat</h2>

                  <div className='flex flex-col gap-y-6 px-4 mx-auto'>
                        <UploadImage image={image} setImage={setImage} />
                        <input
                              type="text"
                              className='bg-gray-100 p-2 py-2 rounded-lg px-3 dark:text-black focus:outline-none focus:ring-1 focus:ring-primary'
                              value={group.chatName}
                              onChange={(e) => setGroup({ ...group, chatName: e.target.value })}
                              placeholder="* Group Name"
                        />
                        <div className='flex relative'>
                              <SearchInput filter={filter} setFilter={setFilter} placeholder="Filter by name or email..." />
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

            </div>
      )
}
