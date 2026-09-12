/// <reference path="../types/express.d.ts" />
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

export const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN as string,
        (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err || !decoded || typeof decoded === "string") {
                res.status(403).json({ message: "Forbidden" });
                return;
            }

            req.user = {
                id: decoded.UserInfo.id,
                username: decoded.UserInfo.username,
                role: decoded.UserInfo.role,
            };

            next();
        }
    );
};