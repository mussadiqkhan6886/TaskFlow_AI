'use client';

import { useState } from 'react';
import ChatStaff from './ChatStaff';
import ChatUser from './ChatUser';

interface ChatWidgetClientProps {
    userId: string;
    isStaff: boolean;
}

export default function ChatWidgetClient({ userId, isStaff }: ChatWidgetClientProps) {
    // Tracks which room is currently open: null, "user-room", or "staff-room"
    const [activeRoom, setActiveRoom] = useState<"user-room" | "staff-room" | null>(null);

    const handleToggle = (room: "user-room" | "staff-room") => {
        setActiveRoom(prev => (prev === room ? null : room));
    };

    return (
        <aside 
            aria-label="Live Chat Assistant"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-row items-end gap-3 pointer-events-none max-w-[calc(100vw-2rem)]"
        >
            {/* User Chat Widget */}
            <div className="pointer-events-auto transition-all duration-300">
                <ChatUser 
                    userId={userId} 
                    isOpen={activeRoom === "user-room"}
                    onToggle={() => handleToggle("user-room")}
                />
            </div>

            {/* Staff / Admin Chat Widget (Conditional) */}
            {isStaff && (
                <div className="pointer-events-auto transition-all duration-300">
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