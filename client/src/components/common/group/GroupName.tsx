import React, { useState } from 'react'
import { toast } from 'react-toastify'

import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import { IChat } from '../../../model/chat.model'

interface Props {
      selectedChat: IChat | null
      onChangeName: (updateType: 'image' | 'name', updateData: string) => Promise<void>
      isAdmin: (chat: IChat, userId?: string | undefined) => boolean
}

export default function GroupName ({ selectedChat, onChangeName, isAdmin }: Props): JSX.Element {
      const [isEditName, setIsEditName] = useState<boolean>(false)
      const [groupName, setGroupName] = useState<string>(selectedChat?.chatName || '')

      function handleKeyPress (e: React.KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                  handleChangeName()
            }
      }

      async function handleChangeName () {
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
                  ) : (
                        <div className="flex items-center text-2xl md:text-2xl justify-center gap-x-2 pt-4">
                              <span className="font-semibold dark:text-dark-primary-text">{selectedChat.chatName}</span>
                              {isAdmin(selectedChat) &&
                                    <EditIcon className="cursor-pointer text-primary dark:text-gray-300" onClick={() => setIsEditName(true)} />}
                        </div>
                  )}
            </>
      )
}
