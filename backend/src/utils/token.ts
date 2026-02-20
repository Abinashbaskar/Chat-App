import jwt from "jsonwebtoken";
import { UserProps } from "../types/chat.types.js";

export const generateToken = (user: UserProps) => {
    const payload = {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        },
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        {
            expiresIn: "7d",
        }
    );
};
