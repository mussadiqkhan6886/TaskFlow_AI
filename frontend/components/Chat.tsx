'use client';
import { formatDate } from '@/lib/helpers/formatDate';
import { getAllMessages } from '@/server/message';
import { socket } from '@/socket';
import { useQuery } from '@tanstack/react-query';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FiInfo, FiSend, FiX, FiMessageSquare } from 'react-icons/fi';
import ChatLoader from './ChatLoader';
import MessageTyping from './MessageTyping';
import { Message } from '@/type';

interface ChatProps {
    name: string;
    room: "staff-room" | "user-room";
    userId: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

const Chat = ({ name, room, userId, isOpen = false, onToggle }: ChatProps) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isFetchingOlder, setIsFetchingOlder] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [infoId, setInfoId] = useState('');
    const [userTypingId, setUserTypingId] = useState<null | { userId: string, username: string }>(null);

    // Initial 10 messages fetch
    const { data: initialResponse, isLoading } = useQuery({
        queryKey: [`messages`, room],
        queryFn: () => getAllMessages(room, { limit: 10 }),
        staleTime: 30_000,
    });

    // Populate state once initial 10 messages arrive
    useEffect(() => {
        if (!initialResponse) return;

        const initialMsgs: Message[] = Array.isArray(initialResponse)
            ? initialResponse
            : (initialResponse.msgs || []);

        const more: boolean = Array.isArray(initialResponse)
            ? false
            : !!initialResponse.hasMore;

        const cursor: string | null = Array.isArray(initialResponse)
            ? null
            : (initialResponse.nextCursor || null);

        setMessages(initialMsgs);
        setHasMore(more);
        setNextCursor(cursor || (initialMsgs.length > 0 ? initialMsgs[0]._id : null));

        // Auto-scroll to bottom on initial load
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        });
    }, [initialResponse, room]);

    // Scroll to bottom when chat opens
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
            socket.emit("mark-messages-read", { room });
        }
    }, [isOpen, room]);

    // Calculate unread count
    const unReadMsgCount = useMemo((): number => {
        return messages.reduce((count: number, m): number => {
            const senderId = typeof m.senderId === "string" ? m.senderId : m.senderId?._id;
            if (senderId === userId) {
                return count;
            }

            const alreadyRead = m.readBy.some((r: any) => {
                const readerId = typeof r.readerId === "string" ? r.readerId : r.readerId?._id;
                return readerId === userId;
            });

            return alreadyRead ? count : count + 1;
        }, 0);
    }, [messages, userId]);

    // Load older 10 messages when scrolling to top
    const loadOlderMessages = async () => {
        const container = scrollContainerRef.current;
        if (!container || isFetchingOlder || !hasMore || !nextCursor) return;

        setIsFetchingOlder(true);
        const prevScrollHeight = container.scrollHeight;
        const prevScrollTop = container.scrollTop;

        try {
            const response = await getAllMessages(room, {
                limit: 10,
                before: nextCursor,
            });

            const olderMsgs: Message[] = Array.isArray(response)
                ? response
                : (response?.msgs || []);

            const more: boolean = Array.isArray(response)
                ? false
                : !!response?.hasMore;

            const cursor: string | null = Array.isArray(response)
                ? null
                : (response?.nextCursor || null);

            if (olderMsgs.length > 0) {
                setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => m._id));
                    const uniqueOlder = olderMsgs.filter((m) => !existingIds.has(m._id));
                    return [...uniqueOlder, ...prev];
                });

                setHasMore(more);
                setNextCursor(cursor || (olderMsgs[0]?._id ?? null));

                // Preserve scroll position without jumping
                requestAnimationFrame(() => {
                    if (scrollContainerRef.current) {
                        const newScrollHeight = scrollContainerRef.current.scrollHeight;
                        const heightDifference = newScrollHeight - prevScrollHeight;
                        scrollContainerRef.current.scrollTop = prevScrollTop + heightDifference;
                    }
                });
            } else {
                setHasMore(false);
                setNextCursor(null);
            }
        } catch (err) {
            console.error("Failed to load older messages", err);
        } finally {
            setIsFetchingOlder(false);
        }
    };

    // Scroll listener for top pagination
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (container.scrollTop <= 40 && hasMore && !isFetchingOlder && nextCursor) {
            loadOlderMessages();
        }
    };

    // Listen for new messages (appends to bottom)
    useEffect(() => {
        const handleNewMessage = (data: Message) => {
            if (data.room !== room) return;

            setMessages((prev) => {
                if (prev.some((m) => m._id === data._id)) return prev;
                return [...prev, data];
            });

            const senderId = typeof data.senderId === "string" ? data.senderId : data.senderId?._id;
            if (isOpen && senderId !== userId) {
                socket.emit("mark-messages-read", {
                    room,
                });
            }

            requestAnimationFrame(() => {
                const container = scrollContainerRef.current;
                const isMine = senderId === userId;
                const isNearBottom = container
                    ? container.scrollHeight - container.scrollTop - container.clientHeight < 150
                    : true;

                if (isMine || isNearBottom) {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            });
        };

        socket.on("new-message", handleNewMessage);
        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [room, userId, isOpen]);

    // Online users listener
    useEffect(() => {
        const handleOnlineUsers = (data: string[]) => {
            setOnlineUsers(data);
        };

        socket.on("online-users", handleOnlineUsers);
        return () => {
            socket.off("online-users", handleOnlineUsers);
        };
    }, [userId]);

    // Messages read listener
    useEffect(() => {
        const handleMessageRead = (data: {
            userId: string;
            room: "staff-room" | "user-room";
            readAt: string;
            messageIds: string[];
            username: string;
        }) => {
            if (data.room !== room) return;

            setMessages((prev) =>
                prev.map((m) => {
                    if (!data.messageIds.includes(m._id)) {
                        return m;
                    }

                    const alreadyRead = m.readBy.some((r: any) => {
                        const readerId = typeof r.readerId === "string" ? r.readerId : r.readerId?._id;
                        return readerId === data.userId;
                    });

                    if (alreadyRead) return m;

                    return {
                        ...m,
                        readBy: [
                            ...m.readBy,
                            {
                                readerId: {
                                    _id: data.userId,
                                    username: data.username,
                                },
                                readAt: data.readAt,
                            },
                        ],
                    };
                })
            );
        };

        socket.on("messages-read", handleMessageRead);
        return () => {
            socket.off("messages-read", handleMessageRead);
        };
    }, [room]);

    // Typing listener
    useEffect(() => {
        const handleTyping = (data: { userId: string, username: string }) => {
            setUserTypingId(data);
        };
        socket.on("user-typing", handleTyping);

        return () => {
            socket.off("user-typing", handleTyping);
        };
    }, []);

    const handleTyping = () => {
        socket.emit("typing", {
            room,
        });
    };

    const submitMessage = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit("send-message", {
            message,
            room,
        });

        setMessage("");
    };

    useEffect(() => {
        if (!userTypingId) return;

        const timer = setTimeout(() => {
            setUserTypingId(null);
        }, 2000);

        return () => clearTimeout(timer);
    }, [userTypingId]);

    const isStaffRoom = room === "staff-room";

    return (
        <div className="relative flex flex-col items-end">
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className={`relative group flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ${
                        isStaffRoom 
                            ? "bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 shadow-orange-500/25 ring-2 ring-orange-500/20" 
                            : "bg-gradient-to-tr from-blue-600 to-purple-600 shadow-blue-500/20"
                    }`}
                    aria-label={`Open ${name} chat`}
                >
                    <FiMessageSquare size={22} />
                    
                    {unReadMsgCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md animate-bounce">
                            {unReadMsgCount > 99 ? "99+" : unReadMsgCount}
                        </span>
                    )}
                </button>
            )}

            {isOpen && (
                <div className={`backdrop-blur-xl relative shadow-2xl border rounded-2xl w-full sm:w-[380px] h-[480px] flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
                    isStaffRoom ? "border-orange-500/30 shadow-orange-500/10 bg-orange-900/15" : "border-slate-800 bg-slate-900/95"
                }`}>
                    
                    {/* Chat Header */}
                    <div className={`border-b p-4 flex items-center justify-between ${
                        isStaffRoom 
                            ? "border-orange-500/20 bg-gradient-to-r from-slate-950 via-orange-950/30 to-slate-950" 
                            : "border-slate-800 bg-slate-950/60"
                    }`}>
                        <div className="flex gap-3 items-center">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md border ${
                                isStaffRoom 
                                    ? "bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 border-orange-400/30 shadow-orange-500/20" 
                                    : "bg-gradient-to-tr from-blue-600 to-purple-600 border-white/10"
                            }`}>
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[12px] text-slate-400 capitalize flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {room.replace("-", " ")}
                                </p>
                            </div>
                        </div>

                        <button 
                            onClick={onToggle} 
                            className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                            aria-label="Close chat"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                    
                    {isLoading ? (
                        <ChatLoader />
                    ) : (
                        <div 
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className={`${isStaffRoom ? "scrollbar-thumb-orange-800" : "scrollbar-thumb-slate-800" } flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin `}
                        >
                            {/* Loading older messages indicator */}
                            {isFetchingOlder && (
                                <div className="py-2 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                    <span>Loading older messages...</span>
                                </div>
                            )}

                            {/* Beginning of chat history badge */}
                            {!hasMore && messages.length > 0 && (
                                <div className="py-2 text-center text-[11px] text-slate-500 font-medium">
                                    Beginning of chat history
                                </div>
                            )}

                            {messages.map((m: Message) => {
                                const sender =
                                    m.sender ??
                                    (typeof m.senderId === "object"
                                        ? {
                                            id: m.senderId._id,
                                            username: m.senderId.username,
                                            role: m.senderId.role,
                                        }
                                        : null);

                                const isMine = sender?.id === userId;
                                const isOnline = sender?.id ? onlineUsers.includes(sender.id) : false;
                                const username = sender?.username ?? "Unknown";
                                const initial = username.charAt(0).toUpperCase();

                                return (
                                    <div
                                        key={m._id}
                                        className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`flex max-w-[85%] gap-2.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                            {!isMine && (
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold relative mt-1">
                                                    <span>{initial}</span>
                                                    <div className={`w-2 h-2 rounded-full absolute -top-0.5 -left-0.5 border border-slate-900 ${isOnline ? "bg-emerald-500" : "bg-slate-600"}`} />
                                                </div>
                                            )}

                                            <div className={`flex gap-1.5 flex-col ${isMine ? "items-end" : "items-start"}`}>
                                                {!isMine && (
                                                    <span className="px-1 text-[11px] font-medium text-slate-400">
                                                        {username}
                                                    </span>
                                                )}

                                                <div className={`flex relative gap-2 items-center ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                                    <div
                                                        className={`max-w-[220px] break-words rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                                            isMine 
                                                                ? `rounded-br-sm bg-gradient-to-r ${isStaffRoom ? "from-orange-600 to-orange-500" : "from-blue-600 to-blue-500"} text-white shadow-md shadow-blue-500/10` 
                                                                : "rounded-bl-sm bg-slate-800/90 border border-slate-700/60 text-slate-200"
                                                        }`}
                                                    >
                                                        {m.message}
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => {
                                                            setInfoId(infoId === m._id ? "" : m._id);
                                                        }} 
                                                        className="text-slate-500 hover:text-slate-300 transition cursor-pointer p-1"
                                                        title="Message info"
                                                    >
                                                        <FiInfo size={13} />
                                                    </button>
                                                </div>

                                                {m._id === infoId && (
                                                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400 space-y-1 shadow-xl z-10">
                                                        <p className="font-mono text-[10px] text-slate-500">{formatDate(m.createdAt)}</p>
                                                        <div className="border-t border-slate-800/80 pt-1">
                                                            {m.readBy.length === 0 ? (
                                                                <p className="text-[10px] text-slate-500 italic">Sent</p>
                                                            ) : (
                                                                m.readBy.map(r => {
                                                                    const reader = typeof r.readerId === "string" ? r.readerId : {
                                                                        id: r.readerId._id,
                                                                        username: r.readerId.username
                                                                    };
                                                                    if (typeof reader === "string") return null;
                                                                    return (
                                                                        <p className="text-[10px] text-emerald-400" key={reader.id}>
                                                                            ✓ Seen by {reader.username}
                                                                        </p>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <MessageTyping userTypingId={userTypingId} userId={userId} />
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                    
                    <form onSubmit={submitMessage} className={`border-t border-slate-800 ${isStaffRoom ? "bg-orange-950/30" : "bg-slate-950/60"} p-2.5 flex items-center gap-2`}>
                        <input
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                handleTyping();
                            }}
                            type="text"
                            placeholder="Type a message..."
                            className={`flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none ring-0 transition`}
                            autoComplete='off'
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className={`${isStaffRoom ? "bg-orange-600 shadow-orange-500/20 hover:bg-orange-500 disabled:hover:bg-orange-600" : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-500 disabled:hover:bg-blue-600"} disabled:opacity-40  text-white rounded-xl p-2.5 transition cursor-pointer shadow-md `}
                            aria-label="Send message"
                        >
                            <FiSend size={15} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chat;
