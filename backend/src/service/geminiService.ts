import { gemini } from "../config/geminiAI";

interface AIRequest {
    action: "summary" | "priority",
    content: string
}
export async function generate({action, content}: AIRequest) {
    let prompt = ''
    
    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}