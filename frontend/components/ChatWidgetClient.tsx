'use client';

import { useState } from 'react';
import ChatStaff from './ChatStaff';
import ChatUser from './ChatUser';

interface ChatWidgetClientProps {
    userId: string;
    isStaff: boolean;
}

export default function ChatWidgetClient({ userId, isStaff }: ChatWidgetClientProps) {
    const [activeRoom, setActiveRoom] = useState<"user-room" | "staff-room" | null>(null);

    const handleToggle = (room: "user-room" | "staff-room") => {
        setActiveRoom(prev => (prev === room ? null : room));
    };

    return (
        <aside 
            aria-label="Live Chat Assistant"
            className="fixed bottom-4 scale-95 sm:scale-100 right-2 sm:bottom-6 sm:right-6 z-50 flex flex-row items-end gap-3 pointer-events-none max-w-[calc(100vw-1rem)]"
        >
            <div className={`pointer-events-auto transition-all duration-300 ${
                activeRoom === "staff-room" ? "hidden sm:block" : "block"
            }`}>
                <ChatUser 
                    userId={userId} 
                    isOpen={activeRoom === "user-room"}
                    onToggle={() => handleToggle("user-room")}
                />
            </div>

            {isStaff && (
                <div className={`pointer-events-auto transition-all duration-300 ${
                    activeRoom === "user-room" ? "hidden sm:block" : "block"
                }`}>
                    <ChatStaff 
                        userId={userId} 
                        isOpen={activeRoom === "staff-room"}
                        onToggle={() => handleToggle("staff-room")}
                    />
                </div>
            )}
        </aside>
    );
}