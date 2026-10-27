import { Request, Response } from "express"
import mongoose from "mongoose"
import { Message } from "../models/MessageModel"

type MessageParams = {
    room: "staff-room" | "user-room";
};

type MessageQuery = {
    limit?: string;
    before?: string;
};

export const getAllMessages = async (req: Request<MessageParams, any, any, MessageQuery>, res: Response) : Promise<void> => {
    const room  = req.params.room

    if(!room){
        res.status(400).json({success:false, message: "Room is required"})
        return
    }

    if(req.user?.role === "Employee" && room === "staff-room"){
        res.status(403).json({success:false, message: "Forbidden"})
        return
    }

    const { limit: queryLimit, before } = req.query || {};

    if (queryLimit !== undefined || before !== undefined) {
        const parsedLimit = parseInt(queryLimit as string, 10);
        const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 15;
        const filter: any = { room };

        if (before) {
            if (mongoose.Types.ObjectId.isValid(before)) {
                filter._id = { $lt: new mongoose.Types.ObjectId(before) };
            } else {
                filter._id = { $lt: before };
            }
        }

        const rawMsgs = await Message.find(filter)
            .populate("senderId", "username role")
            .populate("readBy.readerId", "username role")
            .sort({ _id: -1 })
            .limit(limit + 1);

        const hasMore = rawMsgs.length > limit;
        const paged = hasMore ? rawMsgs.slice(0, limit) : rawMsgs;
        const msgs = [...paged].reverse();
        const nextCursor = hasMore && msgs.length > 0 ? (msgs[0]._id ? String(msgs[0]._id) : null) : null;

        res.status(200).json({
            success: true,
            msgs,
            hasMore,
            nextCursor
        });
        return;
    }

    const msgs = await Message.find({room}).populate("senderId", "username role").populate("readBy.readerId", "username role").sort({createdAt: 1})

    res.status(200).json({success: true, msgs})
}
