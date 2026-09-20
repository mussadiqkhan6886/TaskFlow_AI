import { Socket } from "socket.io";

export const connectRooms = (socket: Socket) => {
    if(socket.user.role !== "Employee"){
        socket.join("staff-room")
    }
    socket.join("user-room")
}