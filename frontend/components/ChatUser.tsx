import Chat from "./Chat"

const ChatUser = ({userId}: {userId: string}) => {
    return <Chat name="E" room="user-room" userId={userId} />
}

export default ChatUser
