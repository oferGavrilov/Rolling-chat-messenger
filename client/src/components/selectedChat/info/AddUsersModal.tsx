import React, { useEffect, useRef, useState } from 'react'
import { IUser } from "../../../model/user.model"
import { useClickOutside } from '../../../custom/useClickOutside'
import { userService } from '../../../services/user.service'
import { toast } from 'react-toastify'
import { chatService } from '../../../services/chat.service'
import useChat from '../../../store/useChat'
import Loading from '../../SkeltonLoading'
import { IChat } from '../../../model/chat.model'
import socketService from '../../../services/socket.service'

interface Props {
      existsUsers: IUser[]
      isOpen: boolean
      selectedChat: IChat | null
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddUsersModal ({ existsUsers, isOpen, selectedChat, setIsOpen }: Props): JSX.Element {
      const usersModal = useRef<HTMLDivElement>(null)
      const [users, setUsers] = useState<IUser[]>([])
      const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
      const [isLoading, setIsLoading] = useState<boolean>(false)

      const { setChats, chats, setSelectedChat } = useChat()

      useClickOutside(usersModal, () => setIsOpen(false), isOpen)

      useEffect(() => {
            loadUsers()
      }, [existsUsers])

      async function loadUsers () {
            try {
                  setIsLoading(true)
                  const allUsers = await userService.getUsers() as IUser[]

                  // Filter out users that already exist in existsUsers array
                  const newUsers = allUsers.filter(user => !existsUsers.some(existsUser => existsUser._id === user._id))

                  setUsers(newUsers)
            } catch (err) {
                  console.error("An error occurred while loading users:", err)
            } finally {
                  setIsLoading(false)
            }
      }

      function handleSelectUsers (user: IUser) {
            setSelectedUsers(prevSelectedUsers => {
                  if (prevSelectedUsers.some(selectedUser => selectedUser._id === user._id)) {
                        return prevSelectedUsers.filter(selectedUserId => selectedUserId._id !== user._id)
                  } else {
                        return [...prevSelectedUsers, user]
                  }
            })
      }

      async function onAddUsers () {
            if (!selectedChat) return
            if (selectedUsers.length === 0) return toast.error('Please select at least one user')

            try {
                  const updatedUsers = await chatService.updateUsersGroup(selectedChat._id, selectedUsers)

                  setChats(chats.map(chat => chat._id === selectedChat?._id ? { ...chat, users: updatedUsers.users } : chat))

                  socketService.emit('add-to-group', { chatId: selectedChat._id, users: selectedUsers })

                  if (selectedChat) {
                        setSelectedChat({ ...selectedChat, users: updatedUsers.users })
                  }

                  toast.success('Users added successfully')

            } catch (err) {
                  console.error("An error occurred while adding users to group:", err)
                  toast.error('An error occurred while adding users to group')
            } finally {
                  setIsOpen(false)
                  setSelectedUsers([])
            }
      }

      function onCloseModal () {
            setSelectedUsers([])
            setIsOpen(false)
      }

      return (
            <div
                  ref={usersModal}
                  className={`users-modal-container ${isOpen ? 'translate-y-2' : '-translate-y-[100vh]'}`}
            >
                  <h2 className='text-2xl text-center py-4 md:py-10'>Users to add:</h2>
                  <div className='max-h-[45vh] md:max-h-[60vh] overflow-auto'>

                        {isLoading && <Loading type="users" />}

                        {(users.length > 0 && !isLoading) && (
                              <ul className='flex flex-col justify-center items-center overflow-auto'>
                                    {users.map(user => (
                                          <li
                                                key={user._id}
                                                onClick={() => handleSelectUsers(user)}
                                                className={`user-modal-card
                                          ${selectedUsers?.some(selectedUser => selectedUser._id === user._id) ? '!bg-primary' : ''}`}
                                          >
                                                <img
                                                      src={user.profileImg}
                                                      className='w-12 h-12 rounded-full object-top object-cover'
                                                      alt="user-profile"
                                                />
                                                <div>
                                                      <p>{user.username}</p>
                                                      <p>{user.email}</p>
                                                </div>
                                          </li>
                                    ))}
                              </ul>
                        )}
                  </div>

                  <div className='flex justify-between p-8'>
                        <button className='users-modal-btn opacity-80 hover:opacity-100' onClick={onCloseModal}>Cancel</button>
                        <button className='users-modal-btn hover:shadow-xl shadow-primary' onClick={onAddUsers}>Add Users</button>
                  </div>
            </div>
      );
}
