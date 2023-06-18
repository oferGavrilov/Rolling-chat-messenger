import { ChatState } from "../context/ChatProvider"

export default function Chat () {
      const { user } = ChatState()
      console.log(user)

      return (
       <div>Chat page</div>
      )
}
