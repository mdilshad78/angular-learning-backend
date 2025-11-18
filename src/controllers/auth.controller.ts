import { Request, Response } from "express"
import Admin from "../models/auth.models";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

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

    const token = generateToken({ id: admin._id.toString(), email: admin.email })

    res.json({
        _id: admin._id,
        email: admin.email,
        token
    })
}