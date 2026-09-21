import { Request, Response } from "express";
import Note from "../models/NoteModel";
import { noteSchema, noteUpdateSchema } from "../schemas/noteSchema";
import { ROLES } from "../lib/constants";
import { redis } from "../config/connectRedis";
import { deleteNoteCache } from "../lib/helpers/deleteCache";
import { notificationHandler } from "../socket/handlers/notificationHandler";

interface filterQuery  {
    priority?: string
    status?: string
}

export const getAllNotes = async (req: Request<{}, {}, {}, filterQuery>, res: Response) : Promise<void> => {
    let filter : Record<string, unknown> = {};
    const {priority, status} = req.query

    if(priority){
        filter.priority = priority
    }

    if(status){
        filter.status = status
    }

    if(req.user?.role === ROLES.EMPLOYEE){
        filter.noteFor = req.user.id;
    }

    const redisNotes = await redis.get(`notes?all=${req.user?.role === ROLES.EMPLOYEE ? "false" : "true"}&priority=${priority}&status=${status}&noteFor=${req.user?.id}`)

    if(redisNotes){
        res.status(200).json({success:true, notes:JSON.parse(redisNotes)})
        return
    }

    const notes = await Note.find(filter)
        .lean()
        .exec();

    await redis.set(`notes?all=${req.user?.role === ROLES.EMPLOYEE ? "false" : "true"}&priority=${priority}&status=${status}&noteFor=${req.user?.id}`, JSON.stringify(notes), {EX: 120})
    res.status(200).json({success:true, notes})
}

export const getSingleNote = async (req: Request, res: Response) : Promise<void> => {
    const {id} = req.params

    if(!id){
        res.status(400).json({success:false, message:"id is required"})
        return
    }

    const redisNote = await redis.get(`note?id=${id}`)

    if(redisNote){
        const note  = JSON.parse(redisNote)
        if (
        req?.user?.role === ROLES.EMPLOYEE &&
        note.noteFor.toString() !== req.user?.id
    ) {
        res.status(403).json({
            message: "Forbidden",
            success: false
        });
        return
    }
        res.status(200).json({success: true, note})
        return
    }

    const note = await Note.findById(id).lean().exec()

    if(!note){
        res.status(404).json({message: "No Note Found", success:false})
        return
    }
    
    if (
        req?.user?.role === ROLES.EMPLOYEE &&
        note.noteFor.toString() !== req.user?.id
    ) {
        res.status(403).json({
            message: "Forbidden",
            success: false
        });
        return
    }

    await redis.set(`note?id=${id}`, JSON.stringify(note) ,{EX: 120})

    res.status(200).json({success: true, note})
}

export const createNewNote = async (req: Request, res: Response) : Promise<void> => {

    const {noteFor, title, description, priority} = req.body

    if(!noteFor || !title || !description || !priority) {
        res.status(400).json({success:false, message: "All fields are required"})
        return
    }

    const safeParsedData = noteSchema.safeParse({noteFor, title, description, priority})

    if(!safeParsedData.success){
        res.status(400).json({success:false, message: "Zod error, please enter correct field data", error:safeParsedData.error})
        return
    }

    const data = safeParsedData.data

    const newNote = await Note.create(data)

    await deleteNoteCache()
    res.status(201).json({success:true, newNote})

}
export const updateNote = async (req: Request, res: Response) : Promise<void> => {
    const {id} = req.params
    
    if(!id){
        res.status(400).json({success:false, message: "Id is required"})
        return
    }
    
    const filter =
    req.user?.role === ROLES.EMPLOYEE
        ? { _id: id, noteFor: req.user.id }
        : { _id: id };

    const updatedData = req.body

    if(Object.keys(updatedData).length === 0){
        res.status(400).json({success:false, message: "Please update any one of given value"})
        return
    }

    const safeParsedNote = noteUpdateSchema.safeParse(updatedData)

    if(!safeParsedNote.success){
        res.status(400).json({success:false, message:"Zod error, please enter correct field data"})
        return
    }

    const data = safeParsedNote.data

    const note = await Note.findOneAndUpdate(filter, data, {new: true, runValidators: true})

    if(!note){
        res.status(404).json({success:false, message: "Note not found or you don't have permission"})
        return
    }

    if(note.status === "Completed"){
        notificationHandler(note.noteFor.toString(), note.title)
    }

    await deleteNoteCache()
    await redis.del(`note?id=${id}`);
    res.status(200).json({success:true, message: "Note updated successfully", note})

}
export const deleteNote = async (req: Request, res: Response) : Promise<void> => {
    const {id} = req.params

    if(!id){
        res.status(400).json({success:false, message: "Id is required"})
        return
    }

    const filter =
        req.user?.role === ROLES.EMPLOYEE
            ? { _id: id, noteFor: req.user.id }
            : { _id: id };

    const note = await Note.findOneAndDelete(filter);

   
    if(!note){
        res.status(404).json({success: false, message: "no note found with this id"})
        return
    }
    await deleteNoteCache()
    res.status(204).send()
}