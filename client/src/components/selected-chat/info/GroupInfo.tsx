import { useState } from "react"

import useChat from "../../../context/useChat"
import { AuthState } from "../../../context/useAuth"

import UploadImage from "../../UploadImage"
import { chatService } from "../../../services/chat.service"

import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

import MediaFiles from "./MediaFiles"
import { IMessage } from "../../../model/message.model"
import AddUsersModal from "./AddUsersModal"

import socketService from "../../../services/socket.service"

// Common
import GroupActionButton from "../../common/group/GroupActionButton"
import GroupUsersList from "../../common/group/GroupUsersList"
import GroupName from "../../common/group/GroupName"

interface Props {
      messages: IMessage[]
      isAddUsers: boolean
      setIsAddUsers: React.Dispatch<React.SetStateAction<boolean>>
}

export default function GroupInfo({ messages, isAddUsers, setIsAddUsers }: Props): JSX.Element {
      const { selectedChat, setSelectedChat, chats, setChats } = useChat()
      const { isAdmin, user: loggedInUser } = AuthState()

      const [image, setImage] = useState<string>(selectedChat?.groupImage || '')

      async function updateGroupInfoAndSetChat(updateType: 'image' | 'name', updateData: string) {
            if (!selectedChat) return;

            try {
                  const newUpdate = await chatService.updateGroupInfo(selectedChat._id, updateType, updateData);
                  let updatedChat = { ...selectedChat };

                  if (updateType === 'image') {
                        updatedChat = { ...updatedChat, groupImage: newUpdate };
                  } else if (updateType === 'name') {
                        updatedChat = { ...updatedChat, chatName: newUpdate };
                  }

                  setSelectedChat(updatedChat);

                  const updatedChats = chats.map(chat => (chat._id === selectedChat._id ? updatedChat : chat));
                  setChats(updatedChats);
            } catch (error) {
                  console.error(error);
            }
      }

      async function onLeaveFromGroup() {
            if (!selectedChat || !loggedInUser) return
            try {
                  const leavedChatId = await chatService.leaveFromGroup(selectedChat._id, loggedInUser._id)

                  socketService.emit('leave-from-group', { chatId: selectedChat._id, userId: loggedInUser._id, chatUsers: selectedChat.users })

                  const chatsToUpdate = chats.filter(chat => chat._id !== leavedChatId)
                  setSelectedChat(null)
                  setChats(chatsToUpdate)
            } catch (err) {
                  console.log(err)
            }
      }

      async function onRemoveGroup() {
            if (!selectedChat || !loggedInUser) return
            try {
                  await chatService.removeChat(selectedChat._id, loggedInUser._id)
                  setSelectedChat(null)
                  setChats(chats.filter(chat => chat._id !== selectedChat._id))
            } catch (err) {
                  console.log(err)
            }
      }

      function isKicked(): boolean {
            return selectedChat?.kickedUsers?.some(kickedUser => kickedUser.userId === loggedInUser?._id) as boolean
      }

      if (!selectedChat) return <div></div>
      return (
            <>
                  <section className={`w-full ${isAddUsers && 'overflow-hidden'}`}>
                        <div className="text-center py-12">
                              {isAdmin(selectedChat) ?
                                    (<UploadImage image={image} setImage={setImage} editImage={updateGroupInfoAndSetChat} />) :
                                    (<img src={selectedChat.groupImage} alt="group-img" className="w-24 h-24 shadow-lg md:w-32 md:h-32 mx-auto rounded-full" />)
                              }

                              <GroupName
                                    selectedChat={selectedChat}
                                    onChangeName={updateGroupInfoAndSetChat}
                                    isAdmin={isAdmin}
                              />

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
                                    <GroupUsersList
                                          selectedChat={selectedChat}
                                          setSelectedChat={setSelectedChat}
                                          loggedInUser={loggedInUser}
                                          isAdmin={isAdmin}
                                    />
                              </div>
                              <GroupActionButton
                                    isKicked={isKicked()}
                                    onRemoveGroup={onRemoveGroup}
                                    onLeaveFromGroup={onLeaveFromGroup}
                              />
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
