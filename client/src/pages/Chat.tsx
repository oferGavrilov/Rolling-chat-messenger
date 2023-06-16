import { useEffect, useState } from "react"
import axios from "axios"
import { IChat } from "../model/chat.model"

export default function Chat () {
      const [chats, setChats] = useState<IChat[]>([])

      useEffect(() => {
            getChats()
      }, [])

      async function getChats () {
            const { data } = await axios.get("/api/chat")
            console.log(data)
            setChats(data)
      }
      return (
            <ul>
                  {chats.map(chat => (
                        <li key={chat._id} className="">{chat.chatName}</li>
                  ))}
            </ul>
      )
}
