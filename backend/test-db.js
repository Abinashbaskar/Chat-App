import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Conversation from './src/models/Conversation.js';
dotenv.config();
const test = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri)
            throw new Error("No MONGODB_URI");
        console.log("Connecting to", uri);
        await mongoose.connect(uri);
        console.log("Connected");
        const conv = await Conversation.create({
            type: "direct",
            participants: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            createdBy: new mongoose.Types.ObjectId()
        });
        console.log("SUCCESS! Created conversation:", conv);
        process.exit(0);
    }
    catch (err) {
        console.error("FAILURE!", err);
        process.exit(1);
    }
};
test();
//# sourceMappingURL=test-db.js.map