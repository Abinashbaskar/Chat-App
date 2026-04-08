import { Socket, Server as SocketIOServer } from "socket.io";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
    socket.on("newConversation", async (data: any) => {
        try {
            if (data.type === "direct") {
                const existingConversation = await Conversation.findOne({
                    type: "direct",
                    participants: { $all: data.participants, $size: 2 },
                }).populate({
                    path: "participants",
                    select: "name avatar email",
                }).lean();
                if (existingConversation) {
                    console.log("Conversation already exists, returning existing one:", existingConversation._id);
                    return socket.emit("newConversation", {
                        success: true,
                        msg: "Conversation already exists",
                        data: existingConversation,
                    });
                }
            }

            console.log("Attempting to create conversation with data:", {
                type: data.type,
                participants: data.participants,
                createdBy: socket.data.userId,
            });

            // create new conversation
            const conversation = await Conversation.create({
                type: data.type,
                participants: data.participants,
                name: data.name || "", 
                avatar: data.avatar || "", 
                createdBy: socket.data.userId,
            });

            console.log("Conversation created successfully:", conversation._id);

            // await conversation.populate({
            //     path: "participants",
            //     select: "name avatar email",

            // });

            // get all connected sockets for other participants
            const connectedSockets = Array.from(io.sockets.sockets.values()).filter(s => data.participants.includes(s.data.userId));
            connectedSockets.forEach((participantSocket) => {
                participantSocket.join(conversation._id.toString());
            })


            //send the conversation data back populated
            const populatedconversation = await Conversation.findById(conversation._id).populate({
                path: "participants",
                select: "name avatar email",
            }).lean();
            if (!populatedconversation) {
                return socket.emit("newConversation", {
                    success: false,
                    msg: "Failed to fetch conversation",
                });
            }
            io.to(conversation._id.toString()).emit("newConversation", {
                success: true,
                msg: "Conversation created successfully",
                data: populatedconversation,
            });

        } catch (error: any) {
            console.log("newConversation error: ", error);
            socket.emit("newConversation", {
                success: false,
                msg: "Failed to create conversation",
            });
        }
    });

    socket.on("getConversations", async () => {
        try {
            const conversations = await Conversation.find({
                participants: socket.data.userId,
            })
                .populate({
                    path: "participants",
                    select: "name avatar email",
                })
                .populate({
                    path: "lastMessage",
                })
                .sort({ updatedAt: -1 });

            socket.emit("getConversations", {
                success: true,
                conversations: conversations,
            });
        } catch (error: any) {
            console.log("getConversations error: ", error);
            socket.emit("getConversations", {
                success: false,
                msg: "Failed to fetch conversations",
            });
        }
    });

    socket.on("sendMessage", async (data: any) => {
        try {
            const { conversationId, content, attachment } = data;
            if (!conversationId || (!content && !attachment)) return;

            const message = await Message.create({
                conversationId,
                senderId: socket.data.userId,
                content,
                attachment
            });

            await message.populate({
                path: "senderId",
                select: "name avatar email"
            });

            // update conversation last message
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: message._id
            });

            // emit to room
            io.to(conversationId).emit("newMessage", {
                success: true,
                message: message
            });

        } catch (error: any) {
            console.log("sendMessage error: ", error);
            socket.emit("sendMessage", {
                success: false,
                msg: "Failed to send message",
            });
        }
    });

    socket.on("getMessages", async (data: any) => {
        try {
            const { conversationId, limit = 50, skip = 0 } = data;
            if (!conversationId) return;

            const messages = await Message.find({ conversationId })
                .populate({
                    path: "senderId",
                    select: "name avatar email"
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            socket.emit("getMessages", {
                success: true,
                messages: messages.reverse(),
                conversationId
            });

        } catch (error: any) {
            console.log("getMessages error: ", error);
            socket.emit("getMessages", {
                success: false,
                msg: "Failed to fetch messages",
            });
        }
    });
}
