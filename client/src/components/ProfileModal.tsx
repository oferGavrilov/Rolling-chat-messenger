import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ChatState } from '../context/ChatProvider';

export default function ProfileModal ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
      const { logout } = ChatState()

      const handleClose = () => {
            setIsOpen(false);
      };

      return (
            <div className='!top-[81px] !right-[16px]'>
                  <Menu
                        id="basic-menu"
                        open={isOpen}
                        onClose={handleClose}
                        MenuListProps={{
                              'aria-labelledby': 'basic-button',
                        }}
                  >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                  </Menu>
            </div>
      );
}
