import { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/user.service'
import Logo from '../assets/icons/Logo'
import HomeIcon from '@mui/icons-material/Home'
import { Tooltip } from '@mui/material'

import Form from '../components/Auth/Form'

import { WavesBlue } from '../assets/icons/Bubble'

export default function Auth () {
      const [isVisible, setIsVisible] = useState(false)
      const navigate = useNavigate()

      useEffect(() => {
            const user = userService.getLoggedinUser()
            if (user) navigate('/chat')
      }, [navigate])


      useEffect(() => {
            const timer = setTimeout(() => {
                  setIsVisible(true)
            }, 3000)

            return () => clearTimeout(timer)
      }, [])

      return (
            <>
                  <div className={`flex justify-center logo-fade-down ${isVisible ? 'hidden' : 'visible'}`}>
                        <Logo width='120' height='120' />
                  </div>
                  <section className={`max-w-lg pt-28 mx-auto relative z-20 fade-down ${isVisible ? 'visible' : 'hidden'}`} >
                        <div className="bg-white rounded-lg p-6 shadow-lg ">
                              <Form />
                              <Tooltip title='Home' placement='right' arrow>
                                    <Link to="/" className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-20 md:top-36 -z-10 bg-primary text-white py-[5px] px-3 rounded-t-md md:rounded-r-md shadow-lg shadow-quaternary ${isVisible ? 'home-btn-animation' : ''}`}>
                                          <HomeIcon />
                                    </Link>
                              </Tooltip>
                        </div>
                  </section >
                  <WavesBlue />
            </>
      )
}
