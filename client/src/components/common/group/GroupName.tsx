import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { IChat } from '../../../model/chat.model'

interface Props {
      selectedChat: IChat | null
      onChangeName: (updateType: 'image' | 'name', updateData: string) => Promise<void>
      isAdmin: (chat: IChat, userId?: string | undefined) => boolean
}

export default function GroupName({ selectedChat, onChangeName, isAdmin }: Props): JSX.Element {
      const [isEditName, setIsEditName] = useState<boolean>(false)
      const [groupName, setGroupName] = useState<string>(selectedChat?.chatName || '')

      function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                  handleChangeName()
            }
      }

      async function handleChangeName() {
            if (!selectedChat) return

            setGroupName(groupName.trim())
            if (groupName === selectedChat.chatName || !groupName) return toast.warn('Please enter a valid name')
            await onChangeName('name', groupName)
            setIsEditName(false)
      }

      if (!selectedChat) return (<div></div>)

      return (
            <>
                  {isEditName ? (
                        <div className="flex justify-center items-center mt-8 mb-3">
                              <input
                                    type="text"
                                    className="bg-gray-100 dark:bg-dark-default-hover-bg max-w-[200px] md:max-w-full dark:text-white border-b-2 text-xl border-primary py-1 pl-4 pr-8 rounded-t-lg"
                                    value={groupName}
                                    onKeyUp={handleKeyPress}
                                    onChange={(e) => setGroupName(e.target.value)}
                              />
                              <div className="flex ml-4">
                                    <div className='flex items-center justify-center'>
                                          <span className="material-symbols-outlined text-primary cursor-pointer mr-4 flex items-center justify-center" onClick={handleChangeName}>done</span>
                                          <span className="material-symbols-outlined cursor-pointer text-red-500" onClick={() => setIsEditName(false)}>close</span>
                                    </div>
                              </div>
                        </div>
                  ) : (
                        <div className="flex items-center text-2xl md:text-2xl justify-center gap-x-2 pt-4">
                              <span className="font-semibold dark:text-dark-primary-text">{selectedChat.chatName}</span>
                              {isAdmin(selectedChat) && (
                                    <span className="material-symbols-outlined cursor-pointer text-primary dark:text-gray-300" onClick={() => setIsEditName(true)}>edit</span>
                              )}
                        </div>
                  )}
            </>
      )
}
