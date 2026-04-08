import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket is not connected");
        return;
    }

    if (off) {
        // turn off listing to this event
        socket.off("testSocket", payload); // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("testSocket", payload); // payload as callback for this
    } else {
        socket.emit("testSocket", payload); // sending payload as data
    }
};

export const updateSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket is not connected");
        return;
    }

    if (off) {
        // turn off listing to this event
        socket.off("updateProfile", payload); // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("updateProfile", payload); // payload as callback for this
    } else {
        socket.emit("updateProfile", payload); // sending payload as data
    }
};

export const getContacts = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket is not connected");
        return;
    }

    if (off) {
        // turn off listing to this event
        socket.off("getContacts", payload); // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("getContacts", payload); // payload as callback for this
    } else {
        socket.emit("getContacts", payload); // sending payload as data
    }
};

export const newConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();
    if (!socket) {
        console.log("Socket is not connected");
        return;
    }

    if (off) {
        // turn off listing to this event
        socket.off("newConversation", payload); // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("newConversation", payload); // payload as callback for this
    } else {
        socket.emit("newConversation", payload); // sending payload as data
    }
};



// export const getMessages = (payload: any, off: boolean = false) => {
//     const socket = getSocket();
//     if (!socket) return;
//     if (off) socket.off("getMessages", payload);
//     else if (typeof payload == "function") socket.on("getMessages", payload);
//     else socket.emit("getMessages", payload);
// };

// export const sendMessage = (payload: any, off: boolean = false) => {
//     const socket = getSocket();
//     if (!socket) return;
//     if (off) socket.off("sendMessage", payload);
//     else if (typeof payload == "function") socket.on("sendMessage", payload);
//     else socket.emit("sendMessage", payload);
// };

// export const newMessage = (payload: any, off: boolean = false) => {
//     const socket = getSocket();
//     console.log("newMessage", payload);
//     if (!socket) return;
//     if (off) socket.off("newMessage", payload);
//     else if (typeof payload == "function") socket.on("newMessage", payload);
//     else socket.emit("newMessage", payload);
// };

// export const getConversations = (payload: any, off: boolean = false) => {
//     const socket = getSocket();
//     if (!socket) return;
//     if (off) socket.off("getConversations", payload);
//     else if (typeof payload == "function") socket.on("getConversations", payload);
//     else socket.emit("getConversations", payload);
// };