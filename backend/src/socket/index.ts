import type { Server, Socket } from "socket.io";
import { socketAuth } from "../middleware/socketAuth";
import { chatHandler } from "./handlers/chatHandler";
import { connectRooms } from "./handlers/connectRooms";
import { getIO } from "../config/socket";

export const socketConfig = () => {
    const io= getIO();
    io.use(socketAuth)
    const onlineUsers = new Set<string>()
    io.on("connection", (socket: Socket) => {

        console.log("Connected:", socket.id);

        connectRooms(socket)

        chatHandler(io,socket)

        const id = socket.user.id;
        onlineUsers.add(id)
        io.emit("online-users", [...onlineUsers])

        socket.on("disconnect", () => {
            onlineUsers.delete(id)
            io.emit("online-users", [...onlineUsers])
            console.log("Disconnected:", socket.id);
        });

});
}