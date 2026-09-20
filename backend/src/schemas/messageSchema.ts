import z from "zod"

export const messageSchema = z.object({
    message: z.string(),
    room: z.enum([
        "user-room",
        "staff-room",
    ]),
})