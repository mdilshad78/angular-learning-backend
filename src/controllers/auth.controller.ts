import { Request, Response } from "express"
import Admin from "../models/auth.models";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateToken";
import jwt from 'jsonwebtoken';

export const AdminRegister = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const exsit = await Admin.findOne({ email });
        if (exsit)
            return res.status(401).json({ message: "User alredy exists!" });

        const hash = await bcrypt.hash(password, 10);
        const admin = await Admin.create({ email, password: hash });
        res.status(201).json({ message: "User Register", admin })

    }
    catch (error) {
        res.status(500).json({ message: "Server error!", error })
    }
}

export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Admin not found!" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Password Wrong" });

    const token = generateAccessToken({ id: admin._id.toString(), email: admin.email })

    res.json({
        _id: admin._id,
        email: admin.email,
        token
    })
}

// export const verifyToken = async (req: Request, res: Response) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.status(401).json({ valid: false, message: "No token provided" })
//         }

//         const token = authHeader.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ valid: false, message: "Token missing" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string }

//         const admin = await Admin.findById(decoded.id).select("-password");
//         if (!admin) {
//             return res.status(401).json({ valid: false, message: "Admin not found" })
//         }

//         res.json({ valid: true, admin })
//     }
//     catch (error) {
//         res.status(401).json({ valid: false, message: "Invalid token" })
//     }
// }