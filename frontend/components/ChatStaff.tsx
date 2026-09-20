import Chat from './Chat';

const ChatStaff = ({userId}: {userId: string}) => {
    return <Chat name="S" room="staff-room" userId={userId} />
}

export default ChatStaff
