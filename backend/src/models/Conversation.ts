import { model, Schema } from "mongoose";
import { ConversationProps } from "../types/chat.types.js";

const ConversationSchema = new Schema<ConversationProps>({
    type: {
        type: String,
        enum: ["personal", "group"],
        required: true,
    },
    name: String,
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    avatar: {
        type: String,
        default: "",
    },
}, { timestamps: true });

export default model<ConversationProps>("Conversation", ConversationSchema);