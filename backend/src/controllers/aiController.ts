import { Request, Response } from "express";
import { aiSchema } from "../schemas/aiSchema";
import Note from "../models/NoteModel";
import { generate } from "../service/geminiService";

export const aiGenerate = async (req: Request, res: Response) : Promise<void> => {
    try{
        const {noteId, action, description} = req.body

        const parsedData = aiSchema.safeParse({noteId, action, description})

        if(!parsedData.success){
            res.status(400).json({message: "Zod error, please enter correct field data", success: false, error: parsedData.error.message})
            return
        }

        const data = parsedData.data
        let response;
        if(!data.description && !data.noteId){

            res.status(400).json({
                success:false,
                message:"Provide noteId or description"
            })

            return;
        }

        if(data.description){
            response = await generate({action, content: data.description})
        }else{
            const findNote = await Note.findById(noteId).lean().exec()
        
            if(!findNote){
                res.status(404).json({message: "Note not found", success: false})
                return
            }
            
            if(findNote.noteFor.toString() !== req.user?.id && req.user?.role === "Employee"){
                res.status(403).json({message:"Forbidden", success: false})
                return
            }

            response = await generate({action, content: findNote.description})
        }

        res.status(200).json({success:true, answer:response})
    }
    catch(error:any){


    if(error.status === 503){

        res.status(503).json({
            success:false,
            message:"AI service is busy. Please try again."
        });

        return;
    }


    res.status(500).json({
        success:false,
        message:"AI generation failed"
    });
}
}