import { useState } from "react"
import { toast } from "react-toastify"
import UploadImage from "../../UploadImage"
import { chatService } from "../../../services/chat.service"

import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CloseIcon from '@mui/icons-material/Close'
import useChat from "../../../store/useChat"
import { AuthState } from "../../../context/useAuth"
import { IChat } from "../../../model/chat.model"
import SearchUsers from "../../SideModal"

export default function GroupInfo () {
      const { selectedChat, setSelectedChat, chats, setChats } = useChat()
      const { isAdmin, user: loggedInUser } = AuthState()

      const [image, setImage] = useState<string>(selectedChat.groupImage)
      const [isEditName, setIsEditName] = useState<boolean>(false)
      const [groupName, setGroupName] = useState<string>(selectedChat.chatName)
      const [isAddUsers, setIsAddUsers] = useState<boolean>(false)

      async function editImage (image: string) {
            const newImage = await chatService.updateGroupImage(selectedChat._id, image)
            const updatedChat = { ...selectedChat, groupImage: newImage } as IChat
            setSelectedChat(updatedChat)
            const updatedChats = chats.map(chat => chat._id === selectedChat._id ? updatedChat : chat)
            setChats(updatedChats)
      }

      async function handleChangeName () {
            setGroupName(groupName.trim())
            if (groupName === selectedChat.chatName || !groupName) return toast.warn('Please enter a valid name')
            const newGroupName = await chatService.updateGroupName(selectedChat._id, groupName)
            const updatedChat = { ...selectedChat, chatName: newGroupName }
            setSelectedChat(updatedChat)
            const updatedChats = chats.map(chat => chat._id === selectedChat._id ? updatedChat : chat)
            setChats(updatedChats)
      }

      function handleKeyPress (e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                  handleChangeName()
            }
      }

      async function onLeaveFromGroup () {
            const updatedChat = await chatService.removeFromGroup(selectedChat._id)

            const chatsToUpdate = chats.filter(chat => chat._id !== updatedChat._id)
            setSelectedChat(null)
            setChats(chatsToUpdate)
      }

      async function onRemoveFromGroup (userId: string) {
            const updatedChat = await chatService.removeFromGroup(selectedChat._id, userId)
            setSelectedChat(updatedChat)
      }

      return (
            <section className="w-full ">
                  <div className="border-b-8 pb-6 border-gray-200 text-center">
                        {isAdmin(selectedChat) ? (<UploadImage image={image} setImage={setImage} editImage={editImage} />
                        ) : (<img src={selectedChat.groupImage} alt="group-img" className="w-24 h-24 shadow-lg md:w-32 md:h-32 mx-auto rounded-full" />)}
                        {!isEditName ? (
                              <div className="flex items-center justify-center gap-x-2 pt-4">
                                    <span className="text-xl md:text-2xl font-semibold">{selectedChat.chatName}</span>
                                    {isAdmin(selectedChat) &&
                                          <EditOutlinedIcon fontSize="small" color="primary" className="cursor-pointer" onClick={() => setIsEditName(true)} />}
                              </div>
                        ) : (
                              <div className="flex justify-center items-center">
                                    <input
                                          type="text"
                                          autoFocus
                                          className="bg-gray-100 border-b-2 text-xl border-primary py-1 pl-4 pr-8 mt-5 mb-2 rounded-t-lg"
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

                        <div className="text-gray-400">Group - {selectedChat.users.length} Participants</div>
                  </div>

                  <div className="flex flex-col gap-y-4 pt-8 px-4 md:px-10 text-gray-500 border-b-8 pb-6 border-gray-200">
                        <div className="flex justify-between items-center px-2 text-gray-500 ">
                              <span>{selectedChat.users.length} Participants</span>
                              <SearchOutlinedIcon className="cursor-pointer" />
                        </div>
                        {isAdmin(selectedChat) && <div className="flex px-1 items-center gap-x-2 hover:bg-gray-100 p-2 cursor-pointer rounded-lg" onClick={() => setIsAddUsers(!isAddUsers)}>
                              <div className="bg-primary text-white p-2 rounded-full">
                                    <PersonAddAltOutlinedIcon />
                              </div>
                              <span>Adding participants</span>
                        </div>}
                        <div className="flex flex-col border-2 rounded-lg">
                              {selectedChat.users.map(user => (
                                    <div key={user._id} className="flex justify-between">
                                          <div className="flex items-center justify-between gap-x-3 border-b-2 last:border-b-0 py-2 hover:bg-gray-100 w-full p-2  cursor-pointer rounded-t-lg">
                                                <div className="flex items-center gap-x-3">
                                                      <img src={user.profileImg} className="w-10 h-10 rounded-full object-cover object-top " alt="profile" />
                                                      <span className="text-lg">{user.username}</span>
                                                </div>
                                                {isAdmin(selectedChat, user._id) && (
                                                      <span className="bg-slate-300 text-white px-2 py-[1px] rounded-md text-sm">
                                                            Admin
                                                      </span>
                                                )}
                                                {(isAdmin(selectedChat, loggedInUser._id) && user._id !== loggedInUser._id) &&
                                                      <div className="flex justify-end text-red-500 hover:bg-red-100 px-1 rounded-md" onClick={() => onRemoveFromGroup(user._id)}>
                                                            Remove
                                                      </div>
                                                }
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>

                  <div className="text-red-500 p-4 mt-2 flex gap-x-2 hover:bg-gray-100 cursor-pointer" onClick={() => onLeaveFromGroup()}>
                        <LogoutOutlinedIcon />
                        Leave The Group
                  </div>

                  <SearchUsers setIsOpen={setIsAddUsers} isAddNewGroup={false} isOpen={isAddUsers} contentType="groups" groupToEdit={selectedChat} />
            </section>
      )
}
