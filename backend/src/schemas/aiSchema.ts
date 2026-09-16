import { z } from "zod";

export const aiNoteSchema = z.object({
    noteId:z.string(),
    action:z.enum([
        "summary",
        "priority",
    ])
});