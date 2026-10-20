import {io} from "socket.io-client"

export const socket = io(process.env.BACKEND_INTERNAL_URL, {
    withCredentials:true,
    autoConnect:false
})
