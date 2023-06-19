import AppHeader from "../components/AppHeader";
import { ChatState } from "../context/ChatProvider"
import AddIcon from '@mui/icons-material/Add';

export default function Chat (): JSX.Element {
      const { selectedChat } = ChatState()
      console.log(selectedChat)

      return (
            <section className="px-4 mx-auto h-screen overflow-hidden" >
                  <AppHeader />
                  <div className="flex my-4 gap-x-6 justify-center h-[85%]">
                        <div className="bg-white  min-w-[400px] rounded-lg p-5 shadow-2xl shadow-tertiary slide-right">
                              <div className="flex justify-between items-center ">
                                    <h2 className="text-[1.2rem]  text-[#6a6868]">My Chats</h2>
                                    <div className="flex items-center gap-x-2 py-2 px-2 bg-quaternary rounded-lg custom-hover">
                                          <span>New Group Chat</span>
                                          <AddIcon />
                                    </div>
                              </div>
                        </div>
                        <div className="flex-1 flex-col bg-white rounded-lg max-w-6xl p-4 shadow-2xl shadow-tertiary h-full slide-left">
                              <div className="flex justify-between pb-2  items-center">
                                    <span className="text-2xl">{selectedChat?.chatName}</span>
                                    <span>Settings</span>
                              </div>
                              <div className="bg-[#E0F2F1] shadow-2xl border-[#c9e4ca] border-2  shadow-[#E0F2F1] h-[95%] rounded-lg">
                              </div>
                        </div>
                  </div>
            </section>
      )
}
