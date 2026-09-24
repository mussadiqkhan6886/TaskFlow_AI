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
            <p className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold relative mt-1 uppercase">
                {userTypingId.username.charAt(0)}
            </p>

            <p className="text-sm text-zinc-100 font-thin animate-pulse">{userTypingId.username} is typing...</p>
        </div>
    );
};

export default MessageTyping
