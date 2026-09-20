'use client';
import { socket } from '@/socket';
import React, { FormEvent, useEffect, useState } from 'react'
import { FiChevronUp, FiSend, FiX } from 'react-icons/fi';

const Chat = ({name, room}: {name: string, room: "staff-room" | "user-room"}) => {
    const [collapsed, setCollapsed] = useState(true)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const handleMessage = (data: Message) => {
            if (data.room !== room) return;
            setMessages((prev) => [...prev, data]);
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
            <div>
                {messages.map(m => (
                    <div key={m._id}>
                        <div>{m.message}</div>
                    </div>
                ))}
            </div>
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
