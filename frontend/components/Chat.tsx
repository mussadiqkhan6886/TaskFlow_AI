'use client';
import { getAllMessages } from '@/server/message';
import { socket } from '@/socket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { FiChevronUp, FiSend, FiX } from 'react-icons/fi';

const Chat = ({name, room, userId}: {name: string, room: "staff-room" | "user-room", userId: string}) => {
    const [collapsed, setCollapsed] = useState(true)
    const [message, setMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const {data: messages = [], isLoading} = useQuery({
        queryKey: [`messages`, room],
        queryFn: () => getAllMessages(room),
        staleTime: 30_000
    })

    const queryClient = useQueryClient()

    useEffect(() => {
        if (!collapsed) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [messages, collapsed]);

    useEffect(() => {
        const handleMessage = (data: Message) => {
            if (data.room !== room) return;
            queryClient.setQueryData<Message[]>(
                ["messages", room],
                (oldMessages = []) => [
                    ...oldMessages,
                    data,
                ]
            );
        };

        socket.on("new-message", handleMessage);

        return () => {
            socket.off("new-message", handleMessage);
        };
    }, [room]);

    const submitMessage = (e: FormEvent) => {
        e.preventDefault()
        if(!message.trim()) return;
        socket.emit("send-message", {
            message,
            room
        })

        setMessage("")
    }

  return (
    <div className={`bg-zinc-100 relative shadow-2xl border border-zinc-200 rounded-t-lg w-[360px] ${collapsed ? "h-[60px]" : "h-[450px]"} flex flex-col`}>
            <div className="border-b border-zinc-800 p-3 flex flex-row items-center justify-between bg-zinc-200">
                <div className=" rounded-full bg-blue-300 border aspect-square border-blue-400">
                    <p className="font-semibold text-[16px] px-3 py-1">{name}</p>
                </div>
                {collapsed ? <FiChevronUp onClick={() => setCollapsed(false)} className="font-semibold cursor-pointer" size={22} />  : <FiX onClick={() => setCollapsed(true)} className="font-semibold cursor-pointer" size={22} />}    
            </div>
            
            {isLoading ? 
                        <div className="flex-1 overflow-y-auto p-3 space-y-4 animate-pulse">
                            {/* Left message */}
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-zinc-300 shrink-0" />

                                <div className="space-y-2">
                                    <div className="h-3 w-16 rounded bg-zinc-300" />
                                    <div className="h-10 w-40 rounded-2xl bg-zinc-300" />
                                </div>
                            </div>

                            {/* Right message */}
                            <div className="flex justify-end">
                                <div className="h-10 w-32 rounded-2xl bg-zinc-300" />
                            </div>

                            {/* Left message */}
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-zinc-300 shrink-0" />

                                <div className="space-y-2">
                                    <div className="h-3 w-20 rounded bg-zinc-300" />
                                    <div className="h-12 w-48 rounded-2xl bg-zinc-300" />
                                </div>
                            </div>

                            {/* Right message */}
                            <div className="flex justify-end">
                                <div className="h-10 w-44 rounded-2xl bg-zinc-300" />
                            </div>
                        </div>
            :
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((m) => {
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

                    const username = sender?.username ?? "Unknown";
                    const initial = username.charAt(0).toUpperCase();

                    return (
                        <div
                            key={m._id}
                            className={`flex w-full ${
                                isMine ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`flex max-w-[80%] gap-2 ${
                                    isMine
                                        ? "flex-row-reverse"
                                        : "flex-row"
                                }`}
                            >
                                {!isMine && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-300 border border-blue-400">
                                        <span className="font-semibold text-sm">
                                            {initial}
                                        </span>
                                    </div>
                                )}

                                <div
                                    className={`flex flex-col ${
                                        isMine
                                            ? "items-end"
                                            : "items-start"
                                    }`}
                                >
                                    {!isMine && (
                                        <span className="mb-1 px-1 text-xs font-semibold text-zinc-500">
                                            {username}
                                        </span>
                                    )}

                                    <div
                                        className={`rounded-2xl px-3 py-2 ${
                                            isMine
                                                ? "rounded-br-sm bg-blue-500 text-white"
                                                : "rounded-bl-sm bg-zinc-200 text-zinc-900"
                                        }`}
                                    >
                                        {m.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            }
            
            <form onSubmit={submitMessage} className="border-t mt-auto border-zinc-800 flex flex-row gap-4 items-center w-full px-2">
                <div className="w-full">
                    <input value={message} onChange={e => setMessage(e.target.value)} type="text" placeholder="Enter your message..." className="p-3 w-full outline-0" />
                </div>
                <button type="submit" className="cursor-pointer  rounded-full p-2">
                    <FiSend size={22}  />
                </button>
            </form>
        </div>
  )
}

export default Chat
