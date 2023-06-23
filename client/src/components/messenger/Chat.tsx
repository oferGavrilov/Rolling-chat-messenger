
import { AiOutlinePaperClip } from 'react-icons/ai'

export default function Chat () {

      return (
            <>
                  <div className='bg-gray-100 border-y border-1 overflow-auto slide-left'>
                  </div>

                  <div className='py-5 flex items-center px-5 gap-x-5'>
                        <div className='text-gray-500  hover:text-gray-600 cursor-pointer'>
                              <AiOutlinePaperClip size={25} />
                        </div>
                        <input
                              type="text"
                              className='bg-gray-100 px-4 w-full rounded-xl py-2 focus-visible:outline-none'
                              placeholder='Type a message...'
                        />
                        <button className='text-primary transition-colors duration-200 ease-in whitespace-nowrap hover:bg-primary hover:text-white p-2 rounded-lg'>Send message</button>
                  </div>
            </>

      )
}
