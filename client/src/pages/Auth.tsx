import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/svg/Logo'
import HomeIcon from '@mui/icons-material/Home'
import { Tooltip } from '@mui/material'

import Form from '../components/Auth/Form'

import { WavesBlue } from '../components/svg/Bubble'
import { AuthState } from '../context/useAuth'

export default function Auth() {
      const [isVisible, setIsVisible] = useState<boolean>(false)
      const { user } = AuthState()
      const navigate = useNavigate()

      useEffect(() => {
            if (user !== null && window.location.pathname !== '/chat') {
                console.log('user is already logged in. Redirecting to chat page...');
                navigate('/chat');
            }
        }, [user, navigate]);


      useEffect(() => {
            document.body.style.overflow = 'hidden'
            const timer = setTimeout(() => {
                  setIsVisible(true)
                  document.body.style.overflow = 'auto'
            }, 3000)

            return () => {
                  clearTimeout(timer)
            }
      }, [])

      return (
            <>
                  <div className={`flex justify-center logo-fade-down ${isVisible ? 'hidden' : 'visible'}`}>
                        <Logo width='120' height='120' />
                  </div>
                  <section className={`max-w-[29rem] lg:max-w-lg py-24 mx-auto relative z-20 fade-down ${isVisible ? 'visible' : 'hidden'}`}>
                        <div className="bg-white rounded-lg p-3 lg:shadow-lg select-none">
                              <Form />
                              <Tooltip title='Home' placement='right' arrow>
                                    <Link to="/" className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-20 md:top-36 -z-10 bg-primary text-base text-white py-[5px] px-3 rounded-t-md md:rounded-r-md shadow-lg shadow-quaternary ${isVisible ? 'home-btn-animation' : ''}`}>
                                          <HomeIcon />
                                    </Link>
                              </Tooltip>
                        </div>
                  </section>
                  <WavesBlue className='slide-up bottom-0 md:-bottom-10 lg:-bottom-20 xl:-bottom-28 2xl:-bottom-36' />
            </>
      )
}
