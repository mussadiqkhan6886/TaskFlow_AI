import { z } from "zod";

export const aiSchema = z.object({
    noteId:z.string().optional(),
    action:z.enum([
        "summary",
        "priority",
    ]),
    description: z.string().optional()
});