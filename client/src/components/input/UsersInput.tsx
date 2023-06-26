import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
      filter: string
      setFilter: React.Dispatch<React.SetStateAction<string>>
      placeholder: string
}

export default function UsersInput ({ filter, setFilter , placeholder}: Props) {
      return (
            <>
                  <input
                        type="text"
                        autoFocus
                        className="w-full h-10 md:h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6294f1] focus:border-transparent"
                        placeholder={placeholder}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                  />

                  {filter &&
                        <CloseIcon
                              className='cursor-pointer absolute right-4 top-9'
                              color='disabled'
                              fontSize="medium"
                              onClick={() => setFilter('')}
                        />}
            </>
      )
}
