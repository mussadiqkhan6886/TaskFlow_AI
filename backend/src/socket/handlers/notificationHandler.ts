import { getIO } from "../../config/socket";
import User from "../../models/UserModel"

export const notificationHandler = async (noteFor: string, title: string) => {
    try {
        const io=getIO();
        const ids = [noteFor, "Admin", "Manager"]

        const user = await User.findById(noteFor).select("username")
        for(const id of ids){
            io.to(id).emit("notification", {
                username: user ? user.username : "unknown",
                title: title
            })
        }
    } catch (error) {
        console.error("Failed to send completion notification", error)
    }

}
export const notificationGetter = async (noteFor: string, userId: string) => {
    try {
        const io = getIO()
        const user = await User.findById(noteFor).select("username")
        io.to(noteFor).emit("notification-note", {
            message: `Task Have Been Assigned To You`
        })

        io.to(userId).emit("notification-note", {
            message: `You Assigned Task to ${user ? user.username : "Unknown"}`
        })
    } catch (error) {
        console.error("Failed to send assignment notification", error)
    }
}