import { useState } from "react"
import UploadImage from "../UploadImage"
import useChat from "../../store/useChat"
import { User } from "../../model/user.model"
import { chatService } from "../../services/chat.service"

import CloseIcon from '@mui/icons-material/Close'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'

export default function ChatInfo ({ conversationUser, setMode }: { conversationUser: User, setMode: CallableFunction }) {
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

      return (
            <div className="flex flex-col items-center py-2 relative">
                  {selectedChat.isGroupChat ? (
                        <section className="w-full ">
                              <div className="border-b-8 pb-6 border-gray-200 text-center">
                                    <UploadImage image={image} setImage={setImage} editImage={editImage} />
                                    {!isEditName ? (
                                          <div className="flex items-center justify-center gap-x-2 pt-4">
                                                <span className="text-2xl font-semibold">{selectedChat.chatName}</span>
                                                <EditOutlinedIcon fontSize="small" color="primary" className="cursor-pointer" onClick={() => setIsEditName(true)} />
                                          </div>
                                    ) : (
                                          <div >
                                                <input
                                                      type="text"
                                                      className="bg-gray-100 border-b-2 text-xl border-primary py-1 pl-4 pr-8 mt-4 mb-2 mr-2 rounded-t-lg"
                                                      value={groupName}
                                                      onKeyUp={handleKeyPress}
                                                      onChange={(e) => setGroupName(e.target.value)}
                                                />
                                                <CheckOutlinedIcon className="text-primary cursor-pointer" onClick={handleChangeName} />
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

                              <div className="text-red-500 p-4 mt-2 flex gap-x-2 hover:bg-gray-100 cursor-pointer">
                                    <LogoutOutlinedIcon />
                                    Leave The Group
                              </div>
                        </section>
                  ) : (
                        <>
                              <img src={conversationUser.profileImg} className="w-32 h-32 rounded-full mb-4 object-cover object-top" alt="profile" />
                              <span className="text-2xl font-semibold">{conversationUser.username}</span>
                              <span className="text-gray-500">{conversationUser.email}</span>
                        </>
                  )}
                  <CloseIcon className="absolute top-0 right-8 cursor-pointer !text-3xl" onClick={() => setMode('chat')} />
            </div>
      )
}
