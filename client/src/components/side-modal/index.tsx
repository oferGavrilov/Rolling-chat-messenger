import React, { useRef } from 'react'

import UsersToMessage from './UsersToMessage'
import UsersToGroup from './UsersToGroup'

import { useClickOutside } from '../../custom-hook/useClickOutside'
import { ContentType } from '../../pages/ChatPage'

interface Props {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      contentType: ContentType
}

export default function SearchUsers(props: Props): JSX.Element {
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
            </div>
      )
}
