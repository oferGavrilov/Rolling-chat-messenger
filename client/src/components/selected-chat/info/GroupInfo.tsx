import React, { Suspense, lazy, useCallback, useState } from "react"
import { IMessage, IChat } from "../../../model/"
import useStore from "../../../context/store/useStore"
import { AuthState } from "../../../context/useAuth"
import UploadImage from "../../UploadImage"
import { chatService } from "../../../services/chat.service"
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import MediaFiles from "./MediaFiles"
import socketService from "../../../services/socket.service"
import { SocketEmitEvents } from "../../../utils/socketEvents"

import GroupActionButton from "../../common/group/GroupActionButton"
import GroupUsersList from "../../common/group/GroupUsersList"
import GroupName from "../../common/group/GroupName"
import { toast } from "react-toastify"

const AddUsersModal = lazy(() => import('./AddUsersModal'))

interface GroupInfoProps {
      messages: IMessage[]
      isAddUsers: boolean
      setIsAddUsers: React.Dispatch<React.SetStateAction<boolean>>
}

const GroupInfo: React.FC<GroupInfoProps> = ({ messages, isAddUsers, setIsAddUsers }) => {
      const { selectedChat, setSelectedChat, chats, setChats } = useStore()
      const { isAdmin, user: loggedInUser } = AuthState()

      const [image, setImage] = useState<string>(selectedChat?.groupImage || '')

      const updateGroupInfoAndSetChat = useCallback(async (updateType: 'image' | 'name', updateData: string): Promise<void> => {
            if (!selectedChat) return;

            try {
                  const newUpdate = await chatService.updateGroupInfo(selectedChat._id, updateType, updateData);
                  const updatedChat: IChat = { ...selectedChat, [updateType === 'image' ? 'groupImage' : 'chatName']: newUpdate };

                  //do it with previous chat
                  setSelectedChat( updatedChat);
                  setChats(chats.map(chat => (chat._id === selectedChat._id ? updatedChat : chat)));

                  //TODO: Emit socket event to update group info
                  socketService.emit(SocketEmitEvents.UPDATE_GROUP_INFO, { chatId: selectedChat._id, chatUsers:selectedChat.users, updateType, updateData })
            } catch (err) {
                  toast.error('Failed to update group info. Try again later.')
                  console.error(err);
            }
      }, [selectedChat, chats, setChats, setSelectedChat]);

      const onLeaveFromGroup = useCallback(async () => {
            if (!selectedChat || !loggedInUser) return

            try {
                  const leavedChatId = await chatService.leaveFromGroup(selectedChat._id, loggedInUser._id)
                  socketService.emit(SocketEmitEvents.USER_LEAVE_GROUP, { chatId: selectedChat._id, leaverId: loggedInUser._id, chatUsers: selectedChat.users })

                  const chatsToUpdate = chats.filter(chat => chat._id !== leavedChatId)
                  setChats(chatsToUpdate)
                  setSelectedChat(null)
            } catch (err) {
                  toast.error('Failed to leave group, Try again later.')
                  console.log(err)
            }
      }, [selectedChat, loggedInUser, chats, setChats, setSelectedChat])

      const onRemoveGroup = useCallback(async () => {
            if (!selectedChat || !loggedInUser) return

            try {
                  await chatService.removeChat(selectedChat._id, loggedInUser._id)
                  const updatedChats = chats.filter(chat => chat._id !== selectedChat._id);
                  setChats(updatedChats);
                  setSelectedChat(null)

            } catch (err) {
                  toast.error('Failed to remove group. Try again later.')
                  console.log(err)
            }
      }, [selectedChat, loggedInUser, chats, setChats, setSelectedChat])

      function isKicked(): boolean {
            return selectedChat?.kickedUsers?.some(kickedUser => kickedUser.userId === loggedInUser?._id) as boolean
      }

      if (!selectedChat) return <div>No chat selected.</div>

      return (
            <>
                  <section className={`w-full ${isAddUsers ? 'overflow-hidden' : ''}`}>
                        <div className="text-center py-6">
                              {isAdmin(selectedChat) ?
                                    (<UploadImage image={image} setImage={setImage} editImage={updateGroupInfoAndSetChat} />) :
                                    (<img src={selectedChat.groupImage} alt="group-img" className="w-24 h-24 shadow-lg md:w-32 md:h-32 mx-auto rounded-full" />)
                              }

                              <GroupName
                                    selectedChat={selectedChat}
                                    onChangeName={updateGroupInfoAndSetChat}
                                    isAdmin={isAdmin}
                              />

                              <div className="text-gray-400 dark:text-gray-200">Group - {selectedChat.users.length} Participants</div>
                        </div>

                        <div className="[&>*]:border-t-[6px] [&>*]:border-gray-200 dark:[&>*]:border-[#2f3e46]">
                              <MediaFiles messages={messages} />

                              <div className="flex flex-col gap-y-4 p-6 px-2 md:px-10 text-gray-500 dark:text-dark-primary-text">
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

                  <Suspense fallback={<div className="spinner"></div>}>
                        <AddUsersModal
                              existsUsers={selectedChat.users}
                              isOpen={isAddUsers}
                              selectedChat={selectedChat}
                              setIsOpen={setIsAddUsers}
                        />
                  </Suspense>
            </>

      )
}
export default GroupInfo
