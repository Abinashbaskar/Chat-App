import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";
import fs from "fs";
import path from "path";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on("testserver", (data: any) => {
        socket.emit("testclient", { msg: "Hello from server", data })
    })
    socket.on("updateProfile", async (data: { name?: string, avatar?: string }) => {
        console.log("Update profile:", data);
        const userId = socket.data.userId;
        if (!userId) {
            return socket.emit('updateprofile', {
                success: false,
                msg: 'Unauthorized'
            })
        }
        try {
            let avatarPath = data.avatar;

            // Handle base64 avatar upload
            if (data.avatar && data.avatar.startsWith("data:image")) {
                const base64Data = data.avatar.split(";base64,").pop();
                if (base64Data) {
                    const extension = data.avatar?.split(';')[0]?.split('/')[1] || 'jpg';
                    const filename = `avatar_${userId}_${Date.now()}.${extension}`;
                    const uploadPath = path.join(process.cwd(), "uploads", filename);

                    // Ensure uploads directory exists (just in case)
                    if (!fs.existsSync(path.join(process.cwd(), "uploads"))) {
                        fs.mkdirSync(path.join(process.cwd(), "uploads"));
                    }

                    fs.writeFileSync(uploadPath, base64Data, { encoding: 'base64' });
                    avatarPath = `/uploads/${filename}`;
                }
            }

            const updatedUser = await User.findByIdAndUpdate(userId, { name: data.name, avatar: avatarPath }, { new: true })
            if (!updatedUser) {
                return socket.emit('updateprofile', {
                    success: false,
                    msg: 'User not found'
                })
            }
            const newToken = generateToken(updatedUser);
            socket.emit('updateProfile', {
                success: true,
                msg: 'Profile updated successfully',
                token: newToken,
                user: updatedUser
            })
        } catch (error) {
            console.log('error updating profile', error)
            socket.emit('updateprofile', {
                success: false,
                msg: 'Error Updating Profile'
            })
        }
    })
}