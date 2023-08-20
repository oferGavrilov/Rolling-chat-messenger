import Skeleton from '@mui/material/Skeleton'
import { useState } from 'react'

export default function ChatLoading ({type}: {type: string}) {

      const LoadingType = (type: string): JSX.Element => {
            switch (type) {
                  case 'users': return <LoadingUsers />
                  case 'chats': return <LoadingMessages />
                  default: return <LoadingUsers />
            }
      }
      
      return LoadingType(type)
}

function LoadingUsers (): JSX.Element {
      const [myArray] = useState(Array.from({ length: 4 }))

      return (
            <section className='flex flex-col gap-y-4'>
                  {myArray.map((_, i) => (
                        <article key={i} className='px-8 relative h-[88px]'>
                              <Skeleton height={140} className='!rounded-xl' />
                              <div className='absolute top-10 left-12 flex gap-x-4'>

                                    <Skeleton height={50} width={50} animation='wave' className='mt-3' variant='circular' />
                                    <div className='flex flex-col mt-1'>
                                          <Skeleton height={30} animation='wave' width={85} className='' />
                                          <Skeleton height={35} animation='wave' width={220} className='' />
                                    </div>
                              </div>
                        </article>
                  ))}
            </section>
      )
}

function LoadingMessages (): JSX.Element {
      const [myArray] = useState(Array.from({ length: 4 }))

      return (
            <section className='flex flex-col gap-y-4 -mt-6'>
                  {myArray.map((_, i) => (
                        <article key={i} className='px-2 relative h-[65px]'>
                              <div className='absolute top-7 left-4 flex gap-x-4'>

                                    <Skeleton height={45} width={45} animation='wave' className='mt-3' variant='circular' />
                                    <div className='flex flex-col mt-2'>
                                          <Skeleton height={25} animation='wave' width={60} className='text-black' />
                                          <Skeleton height={25} animation='wave' width={150} className='' />
                                    </div>
                              </div>
                        </article>
                  ))}
            </section>
      )
}
