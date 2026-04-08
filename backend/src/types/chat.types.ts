import { Document, Types } from "mongoose";

export interface UserProps extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    avatar: string;
    createdAt: Date;
}

export interface ConversationProps extends Document {
    type: "direct" | "group";
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    name?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}
