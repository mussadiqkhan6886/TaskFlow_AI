'use client';

import React, { useState } from 'react'
import { FiChevronUp, FiX } from 'react-icons/fi'

const ChatUser = () => {
    const [collapsed, setCollapsed] = useState(false)
  return (
    <div className={`bg-zinc-100 relative shadow-2xl border border-zinc-200 rounded-t-lg w-[360px] ${collapsed ? "h-[60px]" : "h-[450px]"}`}>
        <div className="border-b border-zinc-800 p-3 flex flex-row items-center justify-between bg-zinc-200">
            <div className=" rounded-full bg-blue-300 border aspect-square border-blue-400">
                <p className="font-semibold text-[16px] px-3 py-1">E</p>
            </div>
            {collapsed ? <FiChevronUp onClick={() => setCollapsed(false)} className="font-semibold cursor-pointer" size={22} />  : <FiX onClick={() => setCollapsed(true)} className="font-semibold cursor-pointer" size={22} />}    
        </div>
    </div>
  )
}

export default ChatUser
