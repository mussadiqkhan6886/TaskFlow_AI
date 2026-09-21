import React from 'react'

interface Props {
    userTypingId: {
        userId: string
        username: string
    } | null
    userId: string
}

const MessageTyping = ({ userTypingId, userId }: Props) => {
    if (!userTypingId || userTypingId.userId === userId) {
        return null;
    }

    return (
        <div className="flex gap-3 items-center">
            <p className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-300 uppercase">
                {userTypingId.username.charAt(0)}
            </p>

            <p className="text-sm text-zinc-700 animate-pulse">{userTypingId.username} is typing...</p>
        </div>
    );
};

export default MessageTyping
