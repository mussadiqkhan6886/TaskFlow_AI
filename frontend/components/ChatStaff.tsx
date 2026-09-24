import Chat from './Chat';

interface ChatStaffProps {
    userId: string;
    isOpen: boolean;
    onToggle: () => void;
}

const ChatStaff = ({ userId, isOpen, onToggle }: ChatStaffProps) => {
    return (
        <Chat 
            name="S" 
            room="staff-room" 
            userId={userId} 
            isOpen={isOpen} 
            onToggle={onToggle} 
        />
    );
}

export default ChatStaff;