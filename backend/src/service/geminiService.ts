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
                given description problem return its priority level in just Low, Medium and High :
                ${content}
            `
            break
    }

    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}