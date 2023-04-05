import mongoose from "mongoose"
import { IChatModel } from "../../types"

const chatModel = new mongoose.Schema<IChatModel>(
    {
        chatName: {
            type: String,
            trim: true
        },
        isGroup: {
            type: Boolean,
            default: false
        },
        groupImage: {
            type: String,
            default: "https://icon-library.com/images/user-icon-silhouette/user-icon-silhouette-20.jpg"
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
)

const Chat = mongoose.models.Chat || mongoose.model<IChatModel>("Chat", chatModel)

export default Chat