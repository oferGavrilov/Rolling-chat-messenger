import { User } from "../../../model/user.model"

interface Props {
      conversationUser: User
}

export default function ChatInfo ({ conversationUser}: Props) {

      return (
            <>
                  <img src={conversationUser.profileImg} className="w-32 h-32 rounded-full mb-4 object-cover object-top" alt="profile" />
                  <span className="text-2xl font-semibold">{conversationUser.username}</span>
                  <span className="text-gray-500">{conversationUser.email}</span>
            </>
      )
}
