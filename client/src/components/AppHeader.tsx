import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';

export default function AppHeader () {
      const { user } = ChatState()

      return (
            <header className='flex justify-between py-6 px-12 items-center'>
                  <Button className='flex items-center justify-center gap-x-1 !py-2 !w-32 !rounded-lg opacity-90 !text-white font-bold !bg-primary !transition-opacity !duration-300 ease-in  shadow-primary shadow-lg hover:opacity-100' color='inherit' >
                        <SearchIcon />
                        Search
                  </Button>
                  <Link to="/" className='font-righteous text-5xl text-primary drop-shadow-[4px_1px_2px_#84a98c]'>Rolling</Link>
                  <div className='flex gap-x-6 items-center'>
                        <NotificationsIcon color='inherit' className='text-[#84a98c] !text-[1.6rem] header-animation' />
                        {user && <img src={user.profileImg} alt="profile-img" className='profile-img-header header-animation' />}
                  </div>
            </header>
      )
}
