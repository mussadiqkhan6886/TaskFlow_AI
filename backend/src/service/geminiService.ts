import { gemini } from "../config/geminiAI";

export async function generate(prompt: string) {
    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}