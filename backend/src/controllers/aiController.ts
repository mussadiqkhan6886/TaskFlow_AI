import { Request, Response } from "express";
import { aiSchema } from "../schemas/aiSchema";
import Note from "../models/NoteModel";
import { generate } from "../service/geminiService";

export const aiGenerate = async (req: Request, res: Response) : Promise<void> => {
    const {noteId, action} = req.body

    const parsedData = aiSchema.safeParse({noteId, action})

    if(!parsedData.success){
        res.send(400).json({message: "Zod error, please enter correct field data", success: false, error: parsedData.error.message})
        return
    }

    const findNote = await Note.findById(noteId).lean().exec()

    if(!findNote){
        res.send(404).json({message: "Note not found", success: false})
        return
    }

    // if(!((findNote.noteFor !== req.user?.id) && req.user?.role === "Employee")){
    //     res.send(401).json({message:"Forbidden", success: false})
    //     return
    // }

    const response = await generate({action, content: findNote.description})

    res.status(200).json({success:true, answer:response})
}