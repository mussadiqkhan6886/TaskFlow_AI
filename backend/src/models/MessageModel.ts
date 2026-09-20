import mongoose from "mongoose"

const messageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true,
        enum: ["user-room", "staff-room"]
    },
    readBy: {
        type: [String],
        required: true
    }
},
    {timestamps: true}
)

export const Message = mongoose.model("Message", messageModel)