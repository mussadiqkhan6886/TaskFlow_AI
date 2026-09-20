import type { Server, Socket } from "socket.io";
import { socketAuth } from "../middleware/socketAuth";
import { chatHandler } from "./handlers/chatHandler";
import { connectRooms } from "./handlers/connectRooms";

export const socketConfig = (io: Server) => {
    io.use(socketAuth)
    io.on("connection", (socket: Socket) => {

        console.log("Connected:", socket.id);
        connectRooms(socket)
        chatHandler(io,socket)

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);
        });

});
}