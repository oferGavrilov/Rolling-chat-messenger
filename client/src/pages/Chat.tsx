import { ChatState } from "../context/ChatProvider"

export default function Chat (): JSX.Element {
      const { user } = ChatState()
      console.log(user)

      return (
       <div>Chat page</div>
      )
}
