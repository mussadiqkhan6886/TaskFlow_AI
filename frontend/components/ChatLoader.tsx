import React from 'react'

const ChatLoader = () => {
  return (
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
  )
}

export default ChatLoader
