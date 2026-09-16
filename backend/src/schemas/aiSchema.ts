import { z } from "zod";

export const aiSchema = z.object({
    noteId:z.string(),
    action:z.enum([
        "summary",
        "priority",
    ])
});