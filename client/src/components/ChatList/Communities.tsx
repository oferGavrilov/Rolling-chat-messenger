
interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Communities ({ setShowSearch }: Props): JSX.Element {
      return (
            <section className='pt-7 relative'>
            <div className='flex justify-between items-center pb-4 '>
                  <h2 className="text-3xl font-sf-regular font-bold ">Communities</h2>
                  <div onClick={() => setShowSearch(true)} className='hover:text-blue-500 hover:bg-gray-200 p-2 flex items-center justify-center rounded-xl transition-colors duration-200 cursor-pointer'>
                        {/* <PersonSearchOutlinedIcon /> */}
                  </div>
            </div>
            <div className='p-2 bg-primary'>
                  yessssssss
            </div>
      </section>
      )
}
