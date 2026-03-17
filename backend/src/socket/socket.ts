import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { registerUserEvents } from './userEvents.js';

let io: SocketIOServer;

export function InitializeSocket(server: http.Server) {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        }
    });

    console.log("WebSocket Server Initialized");

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.warn("Socket connection attempt without token");
            return next(new Error("Authentication error: No token provided"));
        }
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
                return next(new Error("Authentication error: Invalid token"));
            }
            let userData = decoded.user;
            socket.data.user = userData;
            socket.data.userId = userData._id;
            next();
        })
    })

    //when socket connected and register

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId;
        console.log(`User connected ${userId} ${socket.data.name}`);
        registerUserEvents(io, socket);
        socket.on("disconnect", () => {
            console.log(`User disconnected ${userId} ${socket.data.name}`);
        })

    })

    return io;
}

export { io };