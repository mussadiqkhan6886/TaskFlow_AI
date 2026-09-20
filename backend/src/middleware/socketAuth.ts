/// <reference path="../types/socket.d.ts" />
import type { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JwtUser extends JwtPayload {
    UserInfo:{
        id:string;
        username:string;
        role:string;
    }
}


export const socketAuth = (
    socket: Socket,
    next: (err?: Error)=>void
) => {


    const cookie = socket.handshake.headers.cookie;


    if(!cookie){
        return next(new Error("No cookie"));
    }


    const token = cookie
        .split("; ")
        .find(row=>row.startsWith("accessToken="))
        ?.split("=")[1];


    if(!token){
        return next(new Error("No token"));
    }


    try{

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN as string
        ) as JwtUser;


        socket.user = {
            id: decoded.UserInfo.id,
            username: decoded.UserInfo.username,
            role: decoded.UserInfo.role,
        };


        next();


    }catch(error){

        next(new Error("Unauthorized"));

    }

};