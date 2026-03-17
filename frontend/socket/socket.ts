import { SOCKET_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        console.log('connectSocket: No token found in storage');
        throw new Error("No token found");
    }
    console.log('Connecting to socket at:', SOCKET_URL);
    socket = io(SOCKET_URL, {
        auth: {
            token
        }
    });
    //Wait for connection
    await new Promise((resolve) => {
        socket?.on("connect", () => {
            console.log("Socket connected", socket?.id);
            resolve(true);
        });
        socket?.on("connect_error", (err) => {
            console.log("Socket connection error", err.message);
            resolve(false);
        });
    });
    return socket;
}
export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket() {
    socket?.disconnect();
    socket = null;
}