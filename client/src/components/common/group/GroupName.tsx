import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { IChat } from '../../../model/chat.model'

interface Props {
      selectedChat: IChat | null
      onChangeName: (updateType: 'image' | 'name', updateData: string) => Promise<void>
      isAdmin: (chat: IChat, userId?: string | undefined) => boolean
}

const GroupName: React.FC<Props> = ({ selectedChat, onChangeName, isAdmin }) => {
      const [isEditName, setIsEditName] = useState<boolean>(false)
      const [groupName, setGroupName] = useState<string>(selectedChat?.chatName || '')

      const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.key === 'Enter') {
                  handleChangeName();
            }
      }

      const handleChangeName = async (): Promise<void> => {
            if (!selectedChat || !groupName.trim()) {
                  toast.warn('Please enter a valid name.');
                  return;
            }

            if (groupName === selectedChat.chatName) {
                  toast.warn('Please enter a different name.');
                  setIsEditName(false);
                  return;
            }

            await onChangeName('name', groupName.trim());
            setIsEditName(false);
      };

      if (!selectedChat) return (<div>No chat selected.</div>)

      return (
            <>
                  {isEditName ? (
                        <div className="flex justify-center items-center mt-8 mb-3">
                              <input
                                    type="text"
                                    className="input-edit-group-name"
                                    aria-label="Edit group name"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    onKeyUp={handleKeyPress}
                              />
                              <div className="flex ml-4">
                                    <div className='flex items-center justify-center'>
                                          <button
                                                aria-label='Save group name'
                                                className="material-symbols-outlined text-primary cursor-pointer mr-4 flex items-center justify-center"
                                                onClick={handleChangeName}
                                          >
                                                done
                                          </button>
                                          <button
                                                aria-label='Cancel editing group name'
                                                className="material-symbols-outlined cursor-pointer text-red-500"
                                                onClick={() => setIsEditName(false)}
                                          >
                                                close
                                          </button>
                                    </div>
                              </div>
                        </div>
                  ) : (
                        <div className="flex items-center text-2xl justify-center py-3">
                              <span className="font-semibold dark:text-dark-primary-text">{selectedChat.chatName}</span>
                              {isAdmin(selectedChat) && (
                                    <button
                                          aria-label='Edit group name'
                                          className="material-symbols-outlined cursor-pointer text-primary dark:text-gray-300 ml-2"
                                          onClick={() => setIsEditName(true)}
                                    >
                                          edit
                                    </button>
                              )}
                        </div>
                  )}
            </>
      )
}

export default GroupName;
