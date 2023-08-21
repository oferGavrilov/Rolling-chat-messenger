import { useState } from "react"
import { toast } from "react-toastify"

import useChat from "../../../store/useChat"
import { AuthState } from "../../../context/useAuth"

import UploadImage from "../../UploadImage"
import { chatService } from "../../../services/chat.service"

import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import { IChat } from "../../../model/chat.model"
import MediaFiles from "./MediaFiles"
import { IMessage } from "../../../model/message.model"
import AddUsersModal from "./AddUsersModal"
import socketService from "../../../services/socket.service"

interface Props {
      messages: IMessage[]
      isAddUsers: boolean
      setIsAddUsers: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GroupInfo ({ messages, isAddUsers, setIsAddUsers }: Props): JSX.Element {
      const { selectedChat, setSelectedChat, chats, setChats } = useChat()
      const { isAdmin, user: loggedInUser } = AuthState()

      const [image, setImage] = useState<string>(selectedChat?.groupImage || '')
      const [isEditName, setIsEditName] = useState<boolean>(false)
      const [groupName, setGroupName] = useState<string>(selectedChat?.chatName || '')

      async function editImage (image: string) {
            if (!selectedChat) return
            const newImage = await chatService.updateGroupImage(selectedChat._id, image)
            const updatedChat = { ...selectedChat, groupImage: newImage } as IChat
            setSelectedChat(updatedChat)
            const updatedChats = chats.map(chat => chat._id === selectedChat._id ? updatedChat : chat)
            setChats(updatedChats)
      }

      async function handleChangeName () {
            if (!selectedChat) return

            setGroupName(groupName.trim())
            if (groupName === selectedChat.chatName || !groupName) return toast.warn('Please enter a valid name')
            const newGroupName = await chatService.updateGroupName(selectedChat._id, groupName)
            const updatedChat = { ...selectedChat, chatName: newGroupName }
            setSelectedChat(updatedChat)
            const updatedChats = chats.map(chat => chat._id === selectedChat._id ? updatedChat : chat)
            setChats(updatedChats)
            setIsEditName(false)
      }

      function handleKeyPress (e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                  handleChangeName()
            }
      }

      async function onLeaveFromGroup () {
            if (!selectedChat || !loggedInUser) return

            const leavedChatId = await chatService.leaveFromGroup(selectedChat._id, loggedInUser._id)

            socketService.emit('leave-from-group', { chatId: selectedChat._id, userId: loggedInUser._id, chatUsers: selectedChat.users })

            const chatsToUpdate = chats.filter(chat => chat._id !== leavedChatId)
            setSelectedChat(null)
            setChats(chatsToUpdate)
      }

      async function onKickFromGroup (userId: string) {
            if (!selectedChat || !loggedInUser) return

            const updatedChat = await chatService.kickFromGroup(selectedChat._id, userId, loggedInUser._id)

            socketService.emit('kick-from-group', { chatId: selectedChat._id, userId, kickerId: loggedInUser._id })

            setSelectedChat({ ...selectedChat, users: updatedChat.users })
      }

      if (!selectedChat) return <div></div>
      return (
            <>
                  <section className="w-full">
                        <div className="text-center py-4">
                              {isAdmin(selectedChat) ? (<UploadImage image={image} setImage={setImage} editImage={editImage} />
                              ) : (<img src={selectedChat.groupImage} alt="group-img" className="w-24 h-24 shadow-lg md:w-32 md:h-32 mx-auto rounded-full" />)}
                              {!isEditName ? (
                                    <div className="flex items-center text-2xl md:text-2xl justify-center gap-x-2 pt-4">
                                          <span className="font-semibold dark:text-dark-primary-text">{selectedChat.chatName}</span>
                                          {isAdmin(selectedChat) &&
                                                <EditIcon className="cursor-pointer text-primary dark:text-gray-300" onClick={() => setIsEditName(true)} />}
                                    </div>
                              ) : (
                                    <div className="flex justify-center items-center">
                                          <input
                                                type="text"
                                                className="bg-gray-100 dark:bg-dark-default-hover-bg max-w-[200px] md:max-w-full dark:text-white border-b-2 text-xl border-primary py-1 pl-4 pr-8 mt-5 mb-2 rounded-t-lg"
                                                value={groupName}
                                                onKeyUp={handleKeyPress}
                                                onChange={(e) => setGroupName(e.target.value)}
                                          />
                                          <div className="flex ml-4">
                                                <div>
                                                      <CheckOutlinedIcon className="text-primary !text-2xl cursor-pointer mr-4" onClick={handleChangeName} />
                                                      <CloseIcon color="error" className="cursor-pointer !text-2xl" onClick={() => setIsEditName(false)} />
                                                </div>
                                          </div>
                                    </div>
                              )}

                              <div className="text-gray-400 py-3 dark:text-gray-200">Group - {selectedChat.users.length} Participants</div>
                        </div>

                        <div className="[&>*]:border-t-[6px]  [&>*]:border-gray-200 dark:[&>*]:border-[#2f3e46]">
                              <MediaFiles messages={messages} />

                              <div className="flex flex-col gap-y-4 pt-8 px-2 md:px-10 text-gray-500 dark:text-dark-primary-text pb-6">
                                    <div className="flex justify-between items-center px-3">
                                          <span>{selectedChat.users.length} Participants</span>
                                          <div className="hover:bg-dark-tertiary-bg p-2 rounded-full">
                                                <SearchOutlinedIcon className="cursor-pointer" />
                                          </div>
                                    </div>
                                    {isAdmin(selectedChat) && (
                                          <div className="flex px-2 items-center gap-x-4 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg p-2 cursor-pointer rounded-lg" onClick={() => setIsAddUsers(true)}>
                                                <div className="bg-primary text-white h-10 w-10 flex items-center justify-center rounded-full">
                                                      <PersonAddAltOutlinedIcon fontSize="small" />
                                                </div>
                                                <span>Adding participants</span>
                                          </div>
                                    )}
                                    <div className="flex flex-col gap-y-2 border-2 dark:border-dark-primary-bg rounded-lg">
                                          {selectedChat.users.map(user => (
                                                <div key={user._id} className="flex justify-between">
                                                      <div className="flex items-center justify-between gap-x-3 border-b-2 last:border-b-0 py-2 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg w-full p-2  cursor-pointer rounded-lg">
                                                            <div className="flex items-center gap-x-3">
                                                                  <img src={user.profileImg} className="w-10 h-10 rounded-full object-cover object-top " alt="profile" />
                                                                  <span className="text-lg">{user.username}</span>
                                                            </div>
                                                            {isAdmin(selectedChat, user._id) && (
                                                                  <span className="bg-slate-300 dark:bg-dark-primary-bg text-white px-2 py-[1px] rounded-md text-sm">
                                                                        Admin
                                                                  </span>
                                                            )}
                                                            {(isAdmin(selectedChat, loggedInUser?._id) && user._id !== loggedInUser?._id) &&
                                                                  <div className="flex justify-end text-red-600 transition-transform duration-200 hover:scale-125" onClick={() => onKickFromGroup(user._id)}>
                                                                        <DeleteIcon className="!text-2xl" />
                                                                  </div>
                                                            }
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              </div>
                              <div className="text-red-600 p-4 mt-2 flex gap-x-2 hover:bg-gray-100 dark:hover:bg-dark-default-hover-bg cursor-pointer" onClick={() => onLeaveFromGroup()}>
                                    <LogoutOutlinedIcon />
                                    Leave The Group
                              </div>
                        </div>

                  </section>

                  <AddUsersModal
                        existsUsers={selectedChat.users}
                        isOpen={isAddUsers}
                        selectedChat={selectedChat}
                        setIsOpen={setIsAddUsers}
                  />

            </>

      )
}
