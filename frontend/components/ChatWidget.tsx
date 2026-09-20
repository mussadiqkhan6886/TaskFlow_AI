import { getMe } from '@/server/user'
import React from 'react'
import ChatStaff from './ChatStaff'
import ChatUser from './ChatUser'

const ChatWidget = async () => {
    const me = await getMe()
    return  (
        <section>
            {me.role === "Employee" ? <ChatUser /> : 
            <div>
                <ChatUser/>
                <ChatStaff/>
            </div>}
        </section>
    )
}

export default ChatWidget
