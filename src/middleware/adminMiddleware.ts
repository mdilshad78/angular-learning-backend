import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/auth.models";

interface JwtPayload {
    id: string;
    email: string;
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(401).json({ message: "Admin not found (invalid token)" });
        }

        // req.admin = admin;  // secure user data
        res.json({ valid: true, admin })



        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


export const authMiddleware = (req: any, res: Response, next: Function) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }

        const decoded: any = jwt.verify(token, secret);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
