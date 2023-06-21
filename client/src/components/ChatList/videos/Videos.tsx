import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'

interface Props {
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
  contentType: string
}

export default function Videos ({ setShowSearch, contentType }: Props): JSX.Element {
  console.log(contentType)
  return (
    <section className='pt-7 px-4 relative'>
      <div className='flex justify-between items-center pb-4 '>
        <h2 className="text-3xl font-sf-regular font-bold ">Video Calls</h2>
        <div onClick={() => setShowSearch(true)} className='message-filter-icon'>
          <PersonSearchOutlinedIcon />
        </div>
      </div>
      Videos
    </section>
  )
}
