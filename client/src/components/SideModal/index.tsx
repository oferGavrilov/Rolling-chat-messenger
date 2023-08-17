import React, { useRef } from 'react'
import UsersToMessage from './UsersToMessage'
import UsersToGroup from './UsersToGroup'
import { IChat } from '../../model/chat.model'
import { useClickOutside } from '../../custom/useClickOutside'

interface Props {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
      groupToEdit?: IChat
      isAddNewGroup?: boolean
}

export default function SearchUsers (props: Props): JSX.Element {
      const menuRef = useRef<HTMLDivElement>(null)

      useClickOutside(menuRef, () => props.setIsOpen(false), props.isOpen)

      function switchContent () {
            switch (props.contentType) {
                  case 'messages': return <UsersToMessage {...props} />
                  case 'groups': return <UsersToGroup {...props} isAddNewGroup={props.isAddNewGroup} groupToEdit={props.groupToEdit} />
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
