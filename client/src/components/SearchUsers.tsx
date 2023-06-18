import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';

interface Props {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SearchUsers ({ isOpen, setIsOpen }: Props):JSX.Element {
      const list = () => (
            <Box sx={{ width: 375 }} role="presentation" onClick={() => setIsOpen(false)} onKeyDown={() => setIsOpen(false)}>
                  <Typography variant="h6" component='div' className="relative">
                        <CloseIcon className='absolute left-2 top-3 !text-3xl cursor-pointer' onClick={() => setIsOpen(false)} />
                        <h2 className="py-4 text-center shadow-md shadow-gray-300">YES</h2>
                        <ul className='flex flex-col main-text'>
                        </ul>
                  </Typography>
            </Box>
      )

      return (
            <Drawer
                  anchor='left'
                  open={isOpen}
                  onClose={() => setIsOpen(false)}>
                  {list()}

            </Drawer>
      );
}
