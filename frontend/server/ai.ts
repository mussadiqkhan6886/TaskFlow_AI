import { fetchHelper } from "@/lib/helpers/fetchHelper"

export interface PropsAI {
    action: "summary" | "priority",
    noteId: string
    description: string
}

export const generateAi = async (data: PropsAI) : Promise<string> => {
    const result = await fetchHelper<{answer: string}>("ai/generate", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type" : "application/json"}
    })
    return result.answer
}