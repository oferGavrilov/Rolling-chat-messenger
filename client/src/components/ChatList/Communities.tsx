import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Communities ({ setShowSearch }: Props): JSX.Element {
      return (
            <section className='py-7 px-5 relative'>
                  <div className='flex justify-between items-center pb-4 '>
                        <h2 className="text-3xl font-sf-regular font-bold ">Groups</h2>
                        <div onClick={() => setShowSearch(true)} className='message-filter-icon'>
                              <PersonSearchOutlinedIcon />
                        </div>
                  </div>
            </section>
      )
}
