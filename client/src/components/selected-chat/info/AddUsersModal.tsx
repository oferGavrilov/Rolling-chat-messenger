import React, { useEffect, useRef, useState } from 'react'
import { IUser } from "../../../model/user.model"
import { useClickOutside } from '../../../custom-hook/useClickOutside'
import { userService } from '../../../services/user.service'
import { toast } from 'react-toastify'
import { chatService } from '../../../services/chat.service'
import useStore from '../../../context/store/useStore'
import Loading from '../../SkeltonLoading'
import { IChat } from '../../../model/chat.model'
import socketService from '../../../services/socket.service'
import { SocketEmitEvents } from "../../../utils/socketEvents"


import CloseIcon from '@mui/icons-material/Close'

interface Props {
      existsUsers: IUser[]
      isOpen: boolean
      selectedChat: IChat | null
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddUsersModal({ existsUsers, isOpen, selectedChat, setIsOpen }: Props): JSX.Element {
      const usersModal = useRef<HTMLDivElement>(null)
      const [users, setUsers] = useState<IUser[]>([])
      const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
      const [isLoading, setIsLoading] = useState<boolean>(false)

      const { setChats, chats, setSelectedChat } = useStore()

      useClickOutside(usersModal, () => setIsOpen(false), isOpen)

      useEffect(() => {
            if (isOpen) loadUsers()
      }, [isOpen])

      async function loadUsers() {
            try {
                  setIsLoading(true)
                  const allUsers = await userService.getUsers() as IUser[]

                  // Filter out users that already exist in existsUsers array
                  const newUsers = allUsers.filter(user => !existsUsers?.some(existsUser => existsUser._id === user._id))

                  setUsers(newUsers)
            } catch (err) {
                  console.error("An error occurred while loading users:", err)
            } finally {
                  setIsLoading(false)
            }
      }

      function handleSelectUsers(user: IUser) {
            setSelectedUsers(prevSelectedUsers => {
                  if (prevSelectedUsers?.some(selectedUser => selectedUser._id === user._id)) {
                        return prevSelectedUsers.filter(selectedUserId => selectedUserId._id !== user._id)
                  } else {
                        return [...prevSelectedUsers, user]
                  }
            })
      }

      async function onAddUsers() {
            if (!selectedChat) return
            if (selectedUsers.length === 0) return toast.error('Please select at least one user')

            try {
                  const { users: newUsers } = await chatService.updateUsersGroup(selectedChat._id, selectedUsers) as IChat

                  setChats(chats.map(chat => chat._id === selectedChat?._id ? { ...chat, newUsers } : chat))

                  socketService.emit(SocketEmitEvents.ADDED_USERS_TO_GROUP, { chatId: selectedChat._id, usersInChat: selectedChat.users, newUsers })

                  if (selectedChat) {
                        setSelectedChat({ ...selectedChat, users: newUsers })
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

      function onCloseModal() {
            setSelectedUsers([])
            setIsOpen(false)
      }

      return (
            <div
                  ref={usersModal}
                  className={`users-modal-container ${isOpen ? 'translate-y-2' : '-translate-y-[100vh]'}`}
            >
                  <h2 className='text-xl md:text-2xl text-center py-4 md:py-10'>Users to add:</h2>
                  <div className='h-[calc(100%-152px)] md:h-[calc(100%-200px)] overflow-y-auto'>

                        {isLoading && <Loading type="users" />}

                        {(users.length > 0 && !isLoading) && (
                              <ul className='flex flex-col justify-center items-center'>
                                    {users.map(user => (
                                          <li
                                                key={user._id}
                                                onClick={() => handleSelectUsers(user)}
                                                className={`user-modal-card
                                          ${selectedUsers?.some(selectedUser => selectedUser._id === user._id) ? '!bg-primary text-white' : ''}`}
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

                  <div className='absolute bottom-0 flex justify-between w-[90%] px-6 items-center mx-auto'>
                        <button className='users-modal-btn opacity-80 hover:opacity-100' onClick={onCloseModal}>Cancel</button>
                        {selectedUsers.length > 0 && <button className='users-modal-btn hover:shadow-xl shadow-primary' onClick={onAddUsers}>Add Users</button>}
                  </div>

                  <CloseIcon className='absolute top-5 right-3' onClick={onCloseModal} />
            </div>
      );
}
