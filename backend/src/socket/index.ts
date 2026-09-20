import type { Server, Socket } from "socket.io";
import { socketAuth } from "../middleware/socketAuth";

export const socketConfig = (io: Server) => {
    io.use(socketAuth)
    io.on("connection", (socket: Socket) => {

        console.log("Connected:", socket.id);


        socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });

});
}