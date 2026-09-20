import { Socket } from "socket.io";
import { messageSchema } from "../../schemas/messageSchema";
import { Message } from "../../models/MessageModel";
import { Server } from "socket.io";

export const chatHandler = (io: Server, socket: Socket) => {
    socket.on("send-message", async(data) => {
        if(data.room === "staff-room" && socket.user.role === "Employee"){
            socket.emit(
                "error",
                "forbidden"
            );
            return
        }
        console.log(socket.user)
        const message = {
            message: data.message,
            room: data.room,
            readBy: [],
            senderId: socket.user.id
        }

        const parsedData = messageSchema.safeParse(message)

        if(!parsedData.success){
             socket.emit(
                "error",
                "Invalid message"
            );
            return
        }

        const dataMessage = parsedData.data

        const savedMessage = await Message.create(dataMessage)

        io.to(data.room).emit("new-message", {...savedMessage.toObject(), sender:socket.user})

    } )
}