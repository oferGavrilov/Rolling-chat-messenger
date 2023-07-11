import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import UsersToMessage from './UsersToMessage'
import UsersToGroup from './UsersToGroup'
import { IChat } from '../../model/chat.model'

interface Props {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
      groupToEdit?: IChat
      isAddNewGroup?: boolean
}

export default function SearchUsers (props: Props): JSX.Element {

      const list = () => (
            <Box role="presentation" className="w-screen md:w-[420px]" >
                  {switchContent()}
            </Box>
      )

      function switchContent () {
            switch (props.contentType) {
                  case 'messages': return <UsersToMessage {...props} />
                  case 'groups': return <UsersToGroup {...props} isAddNewGroup={props.isAddNewGroup} groupToEdit={props.groupToEdit} />
                  case 'videos': return <div>videos</div>
                  case 'story': return <div>story</div>
                  default: return <UsersToMessage {...props} />
            }
      }

      return (
            <Drawer
                  anchor='left'
                  open={props.isOpen}
                  onClose={() => {
                        props.setIsOpen(false)
                  }
                  } >
                  {list()}

            </Drawer>
      )

}
