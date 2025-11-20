import { Request, Response } from 'express';
import User from '../models/user.models';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../utils/generateToken';
import { error } from 'console';

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
        const phonenumberExist = await User.findOne({ phoneNumber })

        if (userexist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (phonenumberExist) {
            return res.status(401).json({ message: "PhoneNumber already exists" })
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

    const token = generateAccessToken({
        id: user._id.toString(),
        email: user.email ?? ""   // fallback to empty string
    });

    res.json({
        token,
        user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber
        }
    })
}

export const getAllUserData = async (req: Request, res: Response) => {
    try {
        const result = await User.find({})
        res.status(201).json({ message: "User Data", result })
    }
    catch (error) {
        console.log(error)
        res.status(401).json({ message: "User Data Not Found" })
    }
}

export const getOneUserData = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found!" })
        }

        res.status(201).json({ message: "User data", user })
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const profiledataedit = async (req: Request, res: Response) => {
    try {
        const { username, email, phoneNumber } = req.body;
        const profileID = req.params.id;

        // if (!username || !email || !phoneNumber) {
        //     return res.status(401).json({ message: "All field required!" })
        // }

        if (!profileID) {
            return res.status(401).json({ messsage: "Profile Id required!" })
        }

        const updateProfile = await User.findByIdAndUpdate(
            profileID,
            { username, email, phoneNumber },
            { new: true }
        )

        if (!updateProfile) {
            return res.status(401).json({ message: "User not found!" });
        }

        return res.status(201).json({
            message: "Profile update Successfully",
            user: updateProfile
        })
    }
    catch (error) {
        console.error("profile update error", error);
        return res.status(401).json({
            message: "Server Error",
            error
        })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const deleteUser = await User.deleteOne({ _id: id });

        if (!deleteUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(201).json({ message: "User Data deleted Successfully", deleteUser })
    }
    catch (erorr) {
        console.log("Error deleting user", error);
        res.status(401).json({ message: "Internal Server Error!" });
    }
}
