import { BsSearch } from 'react-icons/bs'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { MdKeyboardArrowDown } from 'react-icons/md'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import { useState } from 'react'

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MessageFilter ({ setShowSearch }: Props) {
      const [search, setSearch] = useState<string>('')

      return (
            <div className="mx-4">
                  <div className='flex justify-between items-center pb-4'>
                        <h2 className="text-2xl md:text-3xl font-sf-regular font-bold ">Messages</h2>
                        <div onClick={() => setShowSearch(true)} className='message-filter-icon'>
                              <PersonAddIcon />
                        </div>
                  </div>
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search"
                        className="bg-[#f4f2f2] h-10 w-full px-12 rounded-xl text-lg placeholder:text-lg border-2 border-gray-100 focus:border-blue-400 focus-visible:outline-none" />
                  <BsSearch size={16} className="absolute top-[6rem] left-8  text-[#00000085]" />

                  <AiOutlineArrowDown
                        onClick={() => setSearch('')}
                        size={20}
                        className={`absolute top-[6rem] right-7 text-primary opacity-0 pointer-events-none cursor-pointer ${search ? 'custom-rotate pointer-events-auto opacity-100' : 'reverse-rotate'}`} />

                  <div className='p-3 flex'>
                        Sort by
                        <div className='text-[#2D9CDB] px-2 flex items-center cursor-pointer hover:underline'>
                              Newest
                              <MdKeyboardArrowDown size={20} className="mt-1" />
                        </div>
                  </div>
            </div>
      )
}
