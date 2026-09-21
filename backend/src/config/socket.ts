import { Server } from "socket.io";

let io: Server;

export const initSocket = (server:any)=>{

    io = new Server(server,{
        cors:{
            origin:process.env.FRONTEND_URL,
            credentials:true
        }
    });


    return io;
}


export const getIO = ()=>{

    if(!io){
        throw new Error("Socket.io not initialized");
    }

    return io;

}