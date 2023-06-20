import { ChatState } from '../context/ChatProvider'

export default function Messenger () {
      const { selectedChat } = ChatState()

      return (
            <div className="flex-1 flex-col bg-white rounded-lg max-w-6xl p-4 shadow-2xl shadow-tertiary h-full slide-left">
                  <div className="flex justify-between pb-2  items-center">
                        <span className="text-2xl">{selectedChat?.chatName}</span>
                        <span>Settings</span>
                  </div>
                  <div className="bg-[#E0F2F1] shadow-2xl border-[#c9e4ca] border-2  shadow-[#E0F2F1] h-[95%] rounded-lg">
                  </div>
            </div>)
}
