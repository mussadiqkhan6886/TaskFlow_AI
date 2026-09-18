import { gemini } from "../config/geminiAI";

interface AIRequest {
    action: "summary" | "priority",
    content: string
}
export async function generate({action, content}: AIRequest) {
    let prompt = ''
    
    switch(action){
        case 'summary':
            prompt = `
                summarize this content in short and clear words for better understanding :
                ${content}
            `
            break
        case 'priority':
            prompt = `
                Analyze this note.

                Return ONLY one word:

                High
                Medium
                Low

                Note:
                ${content}
            `
            break
    }

    const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    return response.text;
}