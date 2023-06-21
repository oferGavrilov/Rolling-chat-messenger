import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import useChat from '../../../store/useChat'
import GroupList from './GroupList';

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Communities ({ setShowSearch }: Props): JSX.Element {
      const { chats } = useChat()

      const groups = chats.filter(chat => chat.isGroupChat)

      return (
            <section className='py-7 px-4 relative'>
                  <div className='flex justify-between items-center pb-4 '>
                        <h2 className="text-3xl font-sf-regular font-bold ">Groups</h2>
                        <div onClick={() => setShowSearch(true)} className='message-filter-icon'>
                              <GroupAddOutlinedIcon />
                        </div>
                  </div>
                  <GroupList groups={groups} />
            </section>
      )
}
