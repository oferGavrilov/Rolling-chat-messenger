import CloseIcon from '@mui/icons-material/Close'

interface Props {
      filter: string
      setFilter: React.Dispatch<React.SetStateAction<string>>
      placeholder: string
}

export default function UsersInput ({ filter, setFilter , placeholder}: Props): JSX.Element {
      return (
            <>
                  <input
                        type="text"
                        className="w-full h-10 md:h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary-bg focus:border-transparent"
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
