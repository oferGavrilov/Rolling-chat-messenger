import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import UsersToMessage from './SideMenu/UsersToMessage'
import UsersToGroup from './SideMenu/UsersToGroup'


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
                  case 'groups': return <UsersToGroup {...props} />
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



