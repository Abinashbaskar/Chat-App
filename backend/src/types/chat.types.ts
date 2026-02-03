import { Document, Types } from "mongoose";

export interface UserProps extends Document {
    email: string;
    password: string;
    name: string;
    avatar: string;
    createdAt: Date;

}

export interface ConversationProps extends Document {
    _id: Types.ObjectId;
    type: "direct||group";
    participants: Types.ObjectId[];
    lastMessage: Types.ObjectId;
    createdBy: Types.ObjectId;
    name?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;

}
