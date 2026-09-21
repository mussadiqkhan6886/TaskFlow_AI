import { Socket, Server } from "socket.io";
import { messageSchema } from "../../schemas/messageSchema";
import { Message } from "../../models/MessageModel";

export const chatHandler = (io: Server, socket: Socket) => {
    socket.on("send-message", async(data) => {
        if(data.room === "staff-room" && socket.user.role === "Employee"){
            socket.emit(
                "error",
                "forbidden"
            );
            return
        }
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

    socket.on("mark-messages-read", async ({room}) => {
        try{
            if(room === "staff-room" && socket.user.role == "Employee"){
                return 
            }
            const userId = socket.user.id;
            const readAt = new Date();

            const unreadMsgs = await Message.find({
                room, senderId :{ $ne: userId}, "readBy.readerId": {$ne: userId}
            }).select("_id")

            if(unreadMsgs.length === 0){
                return 
            }
            const messageIds = unreadMsgs.map(
                (message) => message._id
            );
            
            await Message.updateMany(
                {_id: {$in: messageIds}},
                {
                    $push: {
                        readBy: {
                            readerId: userId,
                            readAt
                        }
                    }
                }
            )

            io.to(room).emit("messages-read", {
                room,
                userId,
                readAt,
                messageIds,
                username: socket.user.username
            });
        }catch(error){
            console.error("Mark messages read error:", error);
        }
    })

    socket.on("typing", (data) => {
        socket.to(data.room).emit("user-typing", {
            userId: socket.user.id,
            username: socket.user.username
        })
    })
}
