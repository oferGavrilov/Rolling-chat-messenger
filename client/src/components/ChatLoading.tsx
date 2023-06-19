import Skeleton from '@mui/material/Skeleton';

export default function ChatLoading () {
      return (
            <section className='flex flex-col gap-y-6 '>
                  <article className='px-4 relative h-[88px]'>
                        <Skeleton height={155} className='!rounded-xl' />
                        <div className='absolute top-12 left-9 flex gap-x-4'>

                              <Skeleton height={55} width={55} animation='wave' className='mt-2' variant='circular' />
                              <div className='flex flex-col'>
                                    <Skeleton height={30} animation='wave' width={85} className='' />
                                    <Skeleton height={35} animation='wave' width={220} className='' />
                              </div>
                        </div>
                  </article>
                  
                  <article className='px-4 relative h-[88px]'>
                        <Skeleton height={155} className='!rounded-xl' />
                        <div className='absolute top-12 left-9 flex gap-x-4'>

                              <Skeleton height={55} width={55} animation='wave' className='mt-2' variant='circular' />
                              <div className='flex flex-col'>
                                    <Skeleton height={30} animation='wave' width={85} className='' />
                                    <Skeleton height={35} animation='wave' width={220} className='' />
                              </div>
                        </div>
                  </article>

                  <article className='px-4 relative h-[88px]'>
                        <Skeleton height={155} className='!rounded-xl' />
                        <div className='absolute top-12 left-9 flex gap-x-4'>

                              <Skeleton height={55} width={55} animation='wave' className='mt-2' variant='circular' />
                              <div className='flex flex-col'>
                                    <Skeleton height={30} animation='wave' width={85} className='' />
                                    <Skeleton height={35} animation='wave' width={220} className='' />
                              </div>
                        </div>
                  </article>
                  
                  <article className='px-4 relative h-[88px]'>
                        <Skeleton height={155} className='!rounded-xl' />
                        <div className='absolute top-12 left-9 flex gap-x-4'>

                              <Skeleton height={55} width={55} animation='wave' className='mt-2' variant='circular' />
                              <div className='flex flex-col'>
                                    <Skeleton height={30} animation='wave' width={85} className='' />
                                    <Skeleton height={35} animation='wave' width={220} className='' />
                              </div>
                        </div>
                  </article>
            </section>
      );
}