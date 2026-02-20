import { Socket, Server as SocketIOServer } from "socket.io";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on("testserver", (data: any) => {
        socket.emit("testclient", { msg: "Hello from server", data })
    })
}