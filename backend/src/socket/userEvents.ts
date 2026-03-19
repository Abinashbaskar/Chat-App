import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

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
            const updatedUser = await User.findByIdAndUpdate(userId, { name: data.name, avatar: data.avatar }, { new: true })
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