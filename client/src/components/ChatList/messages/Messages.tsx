import MessageList from './MessageList'
import MessageFilter from './MessageFilter'

interface Props {
      setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Messages ({ setShowSearch }: Props) {

      return (
            <div className="pt-7 relative">
                  <MessageFilter setShowSearch={setShowSearch} />

                  <MessageList />
            </div>
      )
}
