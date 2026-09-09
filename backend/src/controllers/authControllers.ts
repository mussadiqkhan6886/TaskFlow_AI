import { Request, Response } from "express"
import User from "../models/UserModel"
import bcrypt from "bcryptjs"
import jwt, { type JwtPayload } from "jsonwebtoken"

export const login = async (req: Request, res: Response) : Promise<void> => {
    const {username, password} = req.body

    if(!username || !password){
        res.status(400).json({message: "Please Enter both username and password"})
        return
    }

    const user = await User.findOne({username}).lean().exec()

    if(!user || user.status === "InActive"){
        res.status(404).json({message: "No username found with this username or he is inactive"})
        return
    }

    const passMatch = await bcrypt.compare(password, user.password)

    if(!passMatch){
         res.status(401).json({message: "Wrong Password"})
         return
    }

    const accessToken = jwt.sign(
        {
            UserInfo: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        }, 
        process.env.ACCESS_TOKEN as string,
        {expiresIn: "15m"}
    )

    const refreshToken = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.REFRESH_TOKEN as string,
        {expiresIn: '7d'}
    )

    res.cookie(
        "accessToken",
        accessToken,
        {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge:15 * 60 * 1000,
            path:"/"
        }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    })

    res.json({message: "Login Successfully"})
}

export const refresh = async (req: Request, res: Response) => {
    const cookie = req.cookies
    if(!cookie?.refreshToken){
        res.status(401).json({message: "No refresh token"})
        return
    }
    const token = cookie.refreshToken

    jwt.verify(
        token,
        process.env.REFRESH_TOKEN as string,
        async ( 
            err: jwt.VerifyErrors | null,
            decoded: string | JwtPayload | undefined
        ) => {

            if (err || !decoded || typeof decoded === "string") {
                return res.status(403).json({
                    message: "Forbidden",
                });
            }

            const user = await User.findById(decoded.id).lean().exec()

            if(!user){
                res.status(401).json({message: "No User Found"})
                return
            }

            const accessToken = jwt.sign({
                UserInfo:{
                    id: user._id,
                    username: user.username,
                    role:user.role
                }
                },
                process.env.ACCESS_TOKEN as string,
                {expiresIn: '15m'}
            )

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
                path: "/"
            })
            res.json({message: "Token refreshed"})
        }
    )
}
export const logout = async (req: Request, res: Response) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) return res.sendStatus(204) 
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/"
    })

    res.json({message: "Logged out successfully"})
}