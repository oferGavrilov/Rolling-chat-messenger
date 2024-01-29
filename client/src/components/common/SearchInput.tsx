
interface Props {
      filter: string
      setFilter: React.Dispatch<React.SetStateAction<string>>
      placeholder: string
}

export default function SearchInput({ filter, setFilter, placeholder }: Props): JSX.Element {
      return (
            <div className='w-full relative'>
                  <input
                        type="text"
                        className="w-full h-10 md:h-10 px-3 border border-gray-300 rounded-lg dark:text-black focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                        placeholder={placeholder}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                  />
                  {filter ? (
                        <span
                              className="material-symbols-outlined input-icon cursor-pointer"
                              onClick={() => setFilter('')}>
                              close
                        </span>
                  ) : (
                        <span className="material-symbols-outlined input-icon">search</span>
                  )}


            </div>
      )
}
