import { Request, Response } from "express";
import User from "../models/UserModel";
import { updateUserSchema, userSchema } from "../schemas/userSchema";
import bcrypt from "bcryptjs"
import Note from "../models/NoteModel";
import { redis } from "../config/connectRedis";
import { deleteUserCache } from "../lib/helpers/deleteCache";

interface filterQuery {
    status?: "Active" | "InActive"
    search?: string
}

export const getAllUsers = async (req: Request<{}, {}, {}, filterQuery>, res: Response) : Promise<void> => {

    const {status, search} = req.query
    let filter: Record<string, unknown> = {}

    if(status){
        filter.status = status 
    }

    if(search){
        filter.username = {
            $regex: search,
            $options: 'i'
        }
    }

    const redisUsers = await redis.get(`users?status=${status}&search=${search}`)

    if(redisUsers){
        res.status(200).json({success: true, users: JSON.parse(redisUsers)})
        return
    }
    const users = await User.find(filter).select("-password").lean().exec()

    await redis.set(`users?status=${status}&search=${search}`, JSON.stringify(users), {EX: 120})

    res.status(200).json({
        success: true,
        users,
    });
}

export const createNewUser = async (req: Request, res: Response) : Promise<void> => {
    const {role, email, password, username} = req.body

    if(!role || !email || !password || !username){
        res.status(400).json({success: false, message: "All field are required, Please fill al fields"})
        return
    }

    const safeParsedData = userSchema.safeParse({username, password, email, role})

    if(!safeParsedData.success){
        res.status(400).json({success: false, message: "Zod error, please enter correct field data", errors: safeParsedData.error})
        return
    }

    const data = safeParsedData.data

    const hashedPassword = await bcrypt.hash(data.password, 10)

    try{
        const newUser = await User.create({
        username: data.username,
        password: hashedPassword,
        email: data.email,
        role: data.role
        })

        await deleteUserCache()

        res.status(201).json({success: true, message: "New User created",  user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email,
            role:newUser.role
        }})
    }catch(error:any){

        if(error.code === 11000){
            res.status(409).json({
                success: false, message:"Username or email already exists"
            });
            return;
        }

        res.status(500).json({
            success: false, message:"Server error"
        });
     }
    
}

export const updateUser = async (req: Request, res: Response) : Promise<void> => {
    const updatedData = req.body
    const {id} = req.params

    if(!id){
        res.status(400).json({success: false, message: "No id was passed in params"})
        return
    }

    if(Object.keys(updatedData).length === 0){
        res.status(400).json({success: false, message: "Please provide fields to update"})
        return
    }

    const safeParsedData = updateUserSchema.safeParse(updatedData)

    if(!safeParsedData.success){
        res.status(400).json({success: false, message: "Zod error, please enter correct field data", errors: safeParsedData.error})
        return
    }

    const data = safeParsedData.data

    if(data.password){
        data.password = await bcrypt.hash(data.password,10);
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(id, data, {new: true, runValidators: true})

    if(!updatedUser){
        res.status(404).json({success: false, message: "No user found with this id"})
        return
    }

    await deleteUserCache()
    await redis.del("usersIds")
    await redis.del(`user?id=${id}`)
    res.status(200).json({success: true, message: "User updated successfully",  user:{
        id:updatedUser._id,
        username:updatedUser.username,
        email:updatedUser.email,
        role:updatedUser.role,
        status: updatedUser.status
    }})
    }catch(err: any){
        if(err.code === 11000){
            res.status(409).json({
                success: false, message:"Username or email already exists"
            });
            return;
        }

        res.status(500).json({
            success: false, message:"Server error"
        });
    }
}

export const deleteUser = async (req: Request, res: Response) : Promise<void> => {
    const {id} = req.params

     if(!id){
        res.status(400).json({success: false, message: "No id was passed in params"})
        return
    }

    const note = await Note.exists({ noteFor: id })
    if (note) {
        res.status(400).json({ success: false, message: 'User has assigned notes' })
        return
    }
    

    const user = await User.findByIdAndDelete(id)

    if(!user){
        res.status(404).json({success: false, message: "no user found with this id"})
        return
    }

    await deleteUserCache()
    await redis.del(`user?id=${id}`)
    res.status(204).send()
}

export const getSingleUser = async (req: Request, res: Response) : Promise<void> => {
    const {id} = req.params

    if(!id){
        res.status(400).json({success:false, message:"Id is required"})
        return
    }

    const redisUser = await redis.get(`user?id=${id}`)

    if(redisUser){
        res.status(200).json({success: true, user: JSON.parse(redisUser)})
        return
    }

    const user = await User.findById(id).select("-password").lean().exec()

    if(!user){
        res.status(404).json({success:false, message: "No user found with this id"})
        return
    }

    await redis.set(`user?id=${id}`, JSON.stringify(user), {EX:120})

    res.status(200).json({
        success: true,
        user,
    });
}

export const getCurrentUser = async (req: Request, res: Response) : Promise<void> => {
    const id = req.user?.id

    if(!id){
        res.status(400).json({success:false, message:"No Id founded"})
        return
    }

    const user = await User.findById(id).select("username role").lean().exec()

    if(!user){
        res.status(404).json({success:false, message: "No user found with this id"})
        return
    }

    res.status(200).json({success: true, user})
}

export const getUsersIds = async (req: Request, res: Response) : Promise<void> => {
    
    const redisIds = await redis.get("usersIds")
    
    if(redisIds){
        res.status(200).json({success: true, usersId: JSON.parse(redisIds)})
        return
    }
    const users = await User.find({role: {$ne: "Admin"}}).select("id username").lean().exec()

    await redis.set(`usersIds`, JSON.stringify(users), {EX:60})
    res.status(200).json({success: true, usersId: users})
}