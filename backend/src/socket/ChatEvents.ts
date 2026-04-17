import { Socket, Server as SocketIOServer } from "socket.io";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { Types } from "mongoose";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {

    socket.on("getConversation", async (data: any) => {
        try {
            const userId = socket.data.userId;
            const { conversationId } = data;

            if (!userId) {
                return socket.emit("getConversation", {
                    success: false,
                    msg: "Unauthorized"
                });
            }

            if (!conversationId) {
                return socket.emit("getConversation", {
                    success: false,
                    msg: "Conversation ID is required"
                });
            }

            const conversation = await Conversation.findOne({
                _id: conversationId,
                participants: userId
            })
                .populate({
                    path: "participants",
                    select: "name avatar email",
                })
                .sort({ updatedAt: -1 })
                .populate({
                    path: "lastMessage",
                    select: "content senderId attachment createdAt",
                });

            if (!conversation) {
                return socket.emit("getConversation", {
                    success: false,
                    msg: "Conversation not found or access denied"
                });
            }

            socket.emit("getConversation", {
                success: true,
                data: conversation
            });

        } catch (error: any) {
            console.error("getConversation error:", error);
            socket.emit("getConversation", {
                success: false,
                msg: "Failed to fetch conversation"
            });
        }
    });
    socket.on("newConversation", async (data: any) => {
        try {
            console.log("🔥 EVENT RECEIVED:", data);
            console.log("👤 socket.data.userId:", socket.data.userId);

            if (!socket.data.userId) {
                return socket.emit("newConversation", {
                    success: false,
                    msg: "Unauthorized",
                });
            }

            if (!data.participants || !Array.isArray(data.participants)) {
                return socket.emit("newConversation", {
                    success: false,
                    msg: "Participants are required",
                });
            }

            // ✅ Cast all participant IDs to ObjectId
            const participantIds = data.participants.map((id: string) => new Types.ObjectId(id));

            if (data.type === "direct") {
                const existingConversation = await Conversation.findOne({
                    type: "direct",
                    participants: { $all: participantIds, $size: 2 },
                }).populate({
                    path: "participants",
                    select: "name avatar email",
                }).lean();

                if (existingConversation) {
                    console.log("Conversation already exists:", existingConversation._id);
                    return socket.emit("newConversation", {
                        success: true,
                        msg: "Conversation already exists",
                        data: existingConversation,
                    });
                }
            }

            console.log("🛠️ Creating Conversation:", {
                type: data.type,
                name: data.name,
                participantCount: participantIds.length
            });

            const conversation = await Conversation.create({
                type: data.type,
                participants: participantIds, // ✅ use cast IDs
                name: data.name || "",
                avatar: data.avatar || "",
                createdBy: new Types.ObjectId(socket.data.userId), // ✅ cast this too
            });

            console.log("✅ Conversation created:", conversation._id);

            const connectedSockets = Array.from(io.sockets.sockets.values())
                .filter(s => data.participants.includes(s.data.userId));

            connectedSockets.forEach((participantSocket) => {
                participantSocket.join(conversation._id.toString());
            });

            const populatedConversation = await Conversation.findById(conversation._id)
                .populate({
                    path: "participants",
                    select: "name avatar email",
                }).lean();

            if (!populatedConversation) {
                return socket.emit("newConversation", {
                    success: false,
                    msg: "Failed to fetch conversation after creation",
                });
            }

            io.to(conversation._id.toString()).emit("newConversation", {
                success: true,
                msg: "Conversation created successfully",
                data: populatedConversation,
            });

        } catch (error: any) {
            console.error("❌ newConversation error:", error.message, error);
            socket.emit("newConversation", {
                success: false,
                msg: error.message, // ✅ send actual error back for debugging
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

            if (!conversationId) {
                return socket.emit("sendMessage", {
                    success: false,
                    msg: "Conversation ID is required"
                });
            }

            if (!content && !attachment) {
                return socket.emit("sendMessage", {
                    success: false,
                    msg: "Message content or attachment is required"
                });
            }

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

            if (!conversationId) {
                return socket.emit("getMessages", {
                    success: false,
                    msg: "Conversation ID is required"
                });
            }

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
