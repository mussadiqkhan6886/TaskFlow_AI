'use client';
import { formatDate } from '@/lib/helpers/formatDate';
import { getAllMessages } from '@/server/message';
import { socket } from '@/socket';
import { InfiniteData, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { FiChevronUp, FiInfo, FiSend, FiX } from 'react-icons/fi';
import ChatLoader from './ChatLoader';
import MessageTyping from './MessageTyping';

const Chat = ({name, room, userId}: {name: string, room: "staff-room" | "user-room", userId: string}) => {
    const [collapsed, setCollapsed] = useState(true)
    const [message, setMessage] = useState("")
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [infoId, setInfoId] = useState('')
    const [userTypingId, setUserTypingId] = useState<null | {userId: string, username: string}>(null)

    const {data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery<GetMessagesResponse, Error, InfiniteData<GetMessagesResponse>, ["messages", string], string | null>({
        queryKey: [`messages`, room],
        queryFn: ({pageParam}: {pageParam: string | null}) => getAllMessages(room, 20 ,pageParam),
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const handleScroll = () => {

        const container = messagesContainerRef.current;

        if (!container) return;


        if(
            container.scrollTop === 0 &&
            hasNextPage &&
            !isFetchingNextPage
        ){
            fetchNextPage();
        }
    };

    const allMessages = data?.pages.flatMap(page => page.msgs) ?? [];
    const queryClient = useQueryClient()

    useEffect(() => {
        if(!collapsed){
            messagesEndRef.current
                ?.scrollIntoView({
                    behavior:"smooth"
                });

        }
    },[
        allMessages.length,
        collapsed,
        userTypingId
    ]);

    const unReadMsgCount = useMemo(() : number => {
        return allMessages.reduce((count : number, m: Message) : number => {
            const senderId = typeof m.senderId === "string" ? m.senderId : m.senderId._id
            if(senderId === userId){
                return count
            }

            const alreadyRead = m.readBy.some(r => {
                const readerId = typeof r.readerId === "string" ? r.readerId : r.readerId._id
                return readerId === userId
            })

            return alreadyRead ? count : count + 1
        }, 0)
    }, [allMessages, userId])

    useEffect(() => {
        const handleMessage = (data: Message) => {
            if (data.room !== room) return;
            queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
                ["messages", room],
                oldData => {
                    if(!oldData){
                        return oldData
                    }

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page, index) => {
                            if(index !== 0){
                                return page
                            }

                            return {
                                ...page,
                                msgs: [
                                    ...page.msgs,
                                    data
                                ]
                            }
                        })
                    }
                }
            )
            if (!collapsed && data.senderId !== userId) {
                socket.emit("mark-messages-read", {
                    room,
                });
            }

        };

        socket.on("new-message", handleMessage);

        return () => {
            socket.off("new-message", handleMessage);
        };
    }, [room, queryClient, userId, collapsed]);

    useEffect(() => {
        const handleOnlineUsers = (data: string[]) => {
            setOnlineUsers(data);
        };

        socket.on("online-users", handleOnlineUsers);

        return () => {
            socket.off("online-users", handleOnlineUsers);
        };
    }, [userId]);

    useEffect(() => {
        const handleMessageRead = (data: {userId: string, room: "staff-room" | "user-room", readAt: string, messageIds: string[], username: string}) => {

            if(data.room !== room) return

            queryClient.setQueryData<InfiniteData<GetMessagesResponse>>(
                ["messages",room],
                (oldData)=>{

                if(!oldData) return oldData;


                return {
                ...oldData,

                pages: oldData.pages.map(page=>({

                    ...page,

                    msgs:page.msgs.map(message=>{

                        if(!data.messageIds.includes(message._id)){
                            return message;
                        }


                        return {
                            ...message,

                            readBy:[
                                ...message.readBy,

                                {
                                    readerId:{
                                        _id:data.userId,
                                        username:data.username
                                    },

                                    readAt:data.readAt
                                }
                            ]
                        }
                    })

                }))

                }

                })
        }

        socket.on("messages-read", handleMessageRead)

        return () => {socket.off("messages-read", handleMessageRead)}
    }, [room, queryClient])

    useEffect(() => {
        if (!collapsed) {
            socket.emit("mark-messages-read", {
                room,
            });

        }
    }, [room, collapsed]);

    useEffect(() => {
        const handleTyping = (data: {userId: string, username: string}) => {
            setUserTypingId(data)
        }
        socket.on("user-typing", handleTyping)

        return () => {
            socket.off("user-typing", handleTyping)
        }
    }, [])

    const handleTyping = () => {
        socket.emit("typing", {
            room
        })
    }

    const submitMessage = (e: FormEvent) => {
        e.preventDefault()
        if(!message.trim()) return;
        socket.emit("send-message", {
            message,
            room
        })

        setMessage("")
    }
    useEffect(() => {
        if(!userTypingId) return;

        const timer = setTimeout(() => {
            setUserTypingId(null);
        }, 2000);

        return () => clearTimeout(timer);

    }, [userTypingId]);
  return (
    <div className={`bg-zinc-100 relative shadow-2xl border border-zinc-200 rounded-t-lg w-[360px] ${collapsed ? "h-[60px]" : "h-[450px]"} flex flex-col`}>
            <div className="border-b border-zinc-800 p-3 flex flex-row relative items-center justify-between bg-zinc-200">
                <div className="flex gap-3 items-center">
                    <div className=" rounded-full bg-blue-300 border aspect-square border-blue-400">
                        <p className="font-semibold text-[16px] px-3 py-1">{name}</p>
                    </div>
                    <p className="font-semibold capitalize">{room.replace("-", " ")}</p>
                </div>
                {unReadMsgCount > 0 && <div className="absolute -top-3 -right-3 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">{unReadMsgCount > 99 ? "99+" : unReadMsgCount}</div>}
                {collapsed ? <FiChevronUp onClick={() => {
                    setCollapsed(false)
                }} className="font-semibold cursor-pointer" size={22} />  : <FiX onClick={() => setCollapsed(true)} className="font-semibold cursor-pointer" size={22} />}    
            </div>
            
            {isLoading ? <ChatLoader />
            :
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3 space-y-3">

                { isFetchingNextPage && <p className=" text-center text-xs text-gray-500 " >
                Loading older messages...
                </p>
                }


                {allMessages.map((m:Message) => {
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
                            className={`flex w-full ${ isMine ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`flex max-w-[80%] gap-2 ${isMine ? "flex-row-reverse": "flex-row"}`}
                            >
                                {!isMine && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-300 border border-blue-400 relative">
                                        <span className="font-semibold text-sm">
                                            {initial}
                                        </span>
                                        <div className={` ${isOnline ? "bg-green-500" : "bg-zinc-400"} rounded-full p-1.5 absolute -top-1 -left-1`} />
                                    </div>
                                )}

                                <div
                                    className={`flex gap-2 flex-col ${isMine ? "items-end" : "items-start"}`}
                                >
                                    {!isMine && (
                                        <span className="mb-1 px-1 text-xs font-semibold text-zinc-500">
                                            {username}
                                        </span>
                                    )}

                                    <div className={`flex relative gap-3 items-center ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                        <div
                                            className={`max-w-[160px] wrap-break-word rounded-2xl px-3 py-2 ${ isMine ? "rounded-br-sm bg-blue-500 text-white" : "rounded-bl-sm bg-zinc-200 text-zinc-900"}`}>
                                            {m.message}
                                        </div>
                                        <button onClick={() => {
                                            if(infoId && m._id === infoId){
                                                setInfoId("")
                                            }else{
                                                setInfoId(m._id)
                                            }
                                        }} className="cursor-pointer">
                                            <FiInfo />
                                        </button>
                                    </div>
                                    {m._id === infoId && <div className="bg-zinc-200 rounded-full p-0.5">
                                        <p className="text-[11px]">{formatDate(m.createdAt)}</p>
                                        <div>
                                            {m.readBy.map(r => {
                                                const reader = typeof r.readerId === "string" ? r.readerId : {
                                                    id : r.readerId._id,
                                                    username: r.readerId.username
                                                }

                                                if(typeof reader === "string") return null
                                                return <p className="text-xs text-gray-700" key={reader.id}>seen by {reader.username}</p>
                                            })}
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <MessageTyping userTypingId={userTypingId} userId={userId} />
                <div ref={messagesEndRef} />
            </div>
            }
            
            <form onSubmit={submitMessage} className="border-t mt-auto border-zinc-800 flex flex-row gap-4 items-center w-full px-2">
                <div className="w-full">
                    <input value={message} onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                    }} type="text" placeholder="Enter your message..." className="p-3 w-full outline-0" autoComplete='off' />
                </div>
                <button type="submit" className="cursor-pointer  rounded-full p-2">
                    <FiSend size={22}  />
                </button>
            </form>
        </div>
  )
}

export default Chat
