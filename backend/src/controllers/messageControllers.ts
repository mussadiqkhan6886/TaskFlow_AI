import { Request, Response } from "express"
import { Message } from "../models/MessageModel"

type MessageParams = {
    room: "staff-room" | "user-room";
};

export const getAllMessages = async (req: Request<MessageParams>, res: Response) : Promise<void> => {
    const room  = req.params.room

    if(!room){
        res.status(400).json({success:false, message: "Room is required"})
        return
    }

    if(req.user?.role === "Employee" && room === "staff-room"){
        res.status(403).json({success:false, message: "Forbidden"})
        return
    }

    const msgs = await Message.find({room}).populate("senderId", "username role").sort({createdAt: 1})


    res.status(200).json({success: true, msgs})
}