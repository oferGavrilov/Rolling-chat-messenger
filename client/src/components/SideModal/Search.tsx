import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import UsersToMessage from './UsersToMessage'
import UsersToGroup from './UsersToGroup'


interface Props {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      contentType: string
}

export default function SearchUsers (props: Props): JSX.Element {

      const list = () => (
            <Box sx={{ width: 420 }} role="presentation"  >
                  {switchContent()}
            </Box>
      )

      function switchContent () {
            switch (props.contentType) {
                  case 'messages': return <UsersToMessage {...props} />
                  case 'groups': return <UsersToGroup {...props} mode="create" />
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
      );

}



