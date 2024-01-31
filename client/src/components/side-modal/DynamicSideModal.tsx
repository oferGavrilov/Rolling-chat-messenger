import React, { useRef } from 'react'

import { useClickOutside } from '../../custom-hook/useClickOutside'
import { ContentType } from '../../pages/ChatPage'

import UsersToGroup from './UsersToGroup'
import UsersToMessage from './UsersToMessage'
import { WavesBlue } from '../svg/Bubble'

interface Props {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      contentType: ContentType
}

export default function DynamicSideModal(props: Props): JSX.Element {
      const menuRef = useRef<HTMLDivElement>(null)

      useClickOutside(menuRef, () => props.setIsOpen(false), props.isOpen)

      function switchContent() {
            switch (props.contentType) {
                  case 'chats': return <UsersToMessage {...props} />
                  case 'groups': return <UsersToGroup {...props} />
                  case 'videos': return <div>Videos Coming soon...</div>
                  case 'story': return <div>Story Coming soon...</div>
                  default: return <UsersToMessage {...props} />
            }
      }

      return (
            <div
                  ref={menuRef}
                  className={`side-modal-container
                   ${props.isOpen ? 'translate-x-0' : '-translate-x-[100vh]'}`}>
                  {switchContent()}

                  <div className='select-none cursor-pointer absolute right-4 top-6 flex items-center justify-center border-2 border-gray-400 p-1 rounded-full' onClick={() => props.setIsOpen(false)}>
                        <span className="material-symbols-outlined text-gray-400 dark:text-dark-primary-text">close</span>
                  </div>


                  <WavesBlue className="bottom-0 md:-bottom-10 lg:-bottom-20" />

            </div>
      )
}
