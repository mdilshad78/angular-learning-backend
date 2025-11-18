import { Request, Response } from 'express';
import User from '../models/user.models';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';

export const userResister = async (req: Request, res: Response) => {
    try {
        const { username, email, password, phoneNumber, confirmPassword } = req.body;

        if (!username || !email || !password || !phoneNumber) {
            return res.status(401).json({ message: "Username,Eamil,password and phoneNumber is required!" })
        }

        if (password != confirmPassword) {
            return res.status(401).json({ message: "Password or comfirmPassword is not match!" })
        }

        const RegexPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

        if (!RegexPassword.test(password)) {
            return res.status(401).json({
                message: "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character",
            })
        }

        const userexist = await User.findOne({ email });

        if (userexist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashpassword, phoneNumber });

        res.status(201).json({
            message: "User registered",
            data: { user }
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "User not found" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password ?? "");
    if (!passwordMatch) {
        return res.status(401).json({ message: "Password Not match!" })
    }

    const token = generateToken({
        id: user._id.toString(),
        email: user.email ?? ""   // fallback to empty string
    });

    res.json({
        _id: user._id,
        email: user.email,
        token
    })
}
