import mongoose from "mongoose"
import { IMessageModel } from "../../types"

const messageModel = new mongoose.Schema<IMessageModel>(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
    },
    {
        timestamps: true,
    }
)

const Messasge = mongoose.model<IMessageModel>('Message', messageModel)

module.exports = Messasge