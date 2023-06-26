import { BsSearch } from 'react-icons/bs'
import { AiOutlineArrowDown } from 'react-icons/ai'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { useEffect, useState } from 'react'

export default function MessageFilter ({ filter, setFilter }: { filter: string, setFilter: React.Dispatch<React.SetStateAction<string>> }) {

      useEffect(() => {
            setFilter(filter)
      }, [filter, setFilter])
      
      return (
            <div className="mx-4">

                  <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search"
                        className="bg-[#f4f2f2] h-10 w-full px-12 rounded-xl text-lg placeholder:text-lg border-2 border-gray-100 focus:border-blue-400 focus-visible:outline-none" />
                  <BsSearch size={16} className="absolute top-[1.9rem] left-8  text-[#00000075]" />

                  <AiOutlineArrowDown
                        onClick={() => setFilter('')}
                        size={20}
                        className={`absolute top-[1.7rem] right-[1.7rem] text-primary opacity-0 pointer-events-none cursor-pointer ${filter ? 'custom-rotate pointer-events-auto opacity-100' : 'reverse-rotate'}`} />

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
