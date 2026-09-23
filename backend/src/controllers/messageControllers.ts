import { Request, Response } from "express"
import { Message } from "../models/MessageModel"

type MessageParams = {
    room: "staff-room" | "user-room";
};

type QueryType = {
    limit: string,
    cursor?: string
}

export const getAllMessages = async (req: Request<MessageParams,{}, {}, QueryType>, res: Response) : Promise<void> => {
    const room  = req.params.room
    const limit = Number(req.query.limit)
    const cursor = req.query.cursor

    const filter : any = {
        room
    }

    if(cursor){
        filter._id = {$lt: cursor}
    }

    if(!room){
        res.status(400).json({success:false, message: "Room is required"})
        return
    }

    if(req.user?.role === "Employee" && room === "staff-room"){
        res.status(403).json({success:false, message: "Forbidden"})
        return
    }

    const msgs = await Message.find(filter).populate("senderId", "username role").populate("readBy.readerId", "username role").sort({createdAt: -1}).limit(limit+1)

    const hasMore = msgs.length > limit

    if(hasMore){
        msgs.pop()
    }

    res.status(200).json({success: true, msgs, nextCursor: hasMore ? msgs[9]._id : null})
}