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
        type: [
            {
                _id: false,
                readerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required:true
                },
                readAt: {
                    type: Date,
                    required: true
                }
            }
        ],
        default: []
    }
},
    {timestamps: true}
)

export const Message = mongoose.model("Message", messageModel)