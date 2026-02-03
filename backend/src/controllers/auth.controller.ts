import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, avatar } = req.body;
    try {
        //if user already exists
        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        //create new user
        const newUser = new User({
            email,
            password,
            name,
            avatar: avatar || "",
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        //genrate token

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const loginUser = () => { }

