'use client';

import React, { useState } from 'react'
import { FiChevronUp, FiSend, FiX } from 'react-icons/fi'

const ChatUser = () => {
    const [collapsed, setCollapsed] = useState(false)
  return (
    <div className={`bg-zinc-100 relative shadow-2xl border border-zinc-200 rounded-t-lg w-[360px] ${collapsed ? "h-[60px]" : "h-[450px]"} flex flex-col`}>
        <div className="border-b border-zinc-800 p-3 flex flex-row items-center justify-between bg-zinc-200">
            <div className=" rounded-full bg-blue-300 border aspect-square border-blue-400">
                <p className="font-semibold text-[16px] px-3 py-1">E</p>
            </div>
            {collapsed ? <FiChevronUp onClick={() => setCollapsed(false)} className="font-semibold cursor-pointer" size={22} />  : <FiX onClick={() => setCollapsed(true)} className="font-semibold cursor-pointer" size={22} />}    
        </div>
        <div>
        
        </div>
        <form className="border-t mt-auto border-zinc-800 flex flex-row gap-4 items-center w-full px-2">
            <div className="w-full">
                <input type="text" placeholder="Enter your message..." className="p-3 w-full outline-0" />
            </div>
            <button type="submit" className="cursor-pointer  rounded-full p-2">
                <FiSend size={22}  />
            </button>
        </form>
    </div>
  )
}

export default ChatUser
