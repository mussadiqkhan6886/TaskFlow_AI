import type { Server, Socket } from "socket.io";

export const socketConfig = (io: Server) => {
    io.on("connection", (socket: Socket) => {

    console.log("Connected:", socket.id);


    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });

});
}