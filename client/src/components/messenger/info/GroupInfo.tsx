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

export default function GroupInfo () {
      const { selectedChat, setSelectedChat, chats, setChats } = useChat()

      const [image, setImage] = useState<string>(selectedChat.groupImage)
      const [isEditName, setIsEditName] = useState<boolean>(false)

      const [groupName, setGroupName] = useState<string>(selectedChat.chatName)

      async function editImage (image: string) {
            const newImage = await chatService.updateGroupImage(selectedChat._id, image)
            const updatedChat = { ...selectedChat, groupImage: newImage }
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

      async function handleLeaveGroup (userId?: string) {
            const updatedChat = await chatService.removeFromGroup(selectedChat._id, userId)

            const chatsToUpdate = chats.filter(chat => chat._id !== updatedChat._id)
            setSelectedChat(null)
            setChats(chatsToUpdate)
      }


      return (
            <section className="w-full ">
                  <div className="border-b-8 pb-6 border-gray-200 text-center">
                        <UploadImage image={image} setImage={setImage} editImage={editImage} />
                        {!isEditName ? (
                              <div className="flex items-center justify-center gap-x-2 pt-4">
                                    <span className="text-2xl font-semibold">{selectedChat.chatName}</span>
                                    <EditOutlinedIcon fontSize="small" color="primary" className="cursor-pointer" onClick={() => setIsEditName(true)} />
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

                  <div className="flex flex-col gap-y-4 pt-8 px-10 text-gray-500 border-b-8 pb-6 border-gray-200">
                        <div className="flex justify-between items-center text-gray-500 ">
                              <span>{selectedChat.users.length} Participants</span>
                              <SearchOutlinedIcon className="cursor-pointer" />
                        </div>
                        <div className="flex px-2 items-center hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                              <div className="bg-primary text-white p-2 mr-2 rounded-full">
                                    <PersonAddAltOutlinedIcon />
                              </div>
                              <span>Adding participants</span>
                        </div>
                        <div className="px-2 flex flex-col gap-y-2 ">
                              {selectedChat.users.map(user => (
                                    <div key={user._id} className="flex items-center gap-x-3  py-2 hover:bg-gray-100 p-2 cursor-pointer rounded-lg">
                                          <img src={user.profileImg} className="w-10 h-10 rounded-full object-cover object-top " alt="profile" />
                                          <span>{user.username}</span>
                                    </div>
                              ))}
                        </div>
                  </div>

                  <div className="text-red-500 p-4 mt-2 flex gap-x-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLeaveGroup()}>
                        <LogoutOutlinedIcon />
                        Leave The Group
                  </div>
            </section>
      )
}
