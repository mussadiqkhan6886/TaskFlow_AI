import Chat from "./Chat"

interface ChatUserProps {
    userId: string;
    isOpen: boolean;
    onToggle: () => void;
}

const ChatUser = ({ userId, isOpen, onToggle }: ChatUserProps) => {
    return (
        <Chat 
            name="E" 
            room="user-room" 
            userId={userId} 
            isOpen={isOpen} 
            onToggle={onToggle} 
        />
    );
}

export default ChatUser;