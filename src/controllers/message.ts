import { ExtendedRequest } from "@/types";
import { NextApiResponse } from "next";
import { accessChat, fetchChats } from '@/controllers/chat'
import authenticate from '@/middlewares/authenticate'
import initDB from '@/middlewares/connectDB'
import nc from "next-connect";
import User from "../models/userModel"
import Chat from "../models/chatModel"
import Message from "../models/messageModel"


const sendMessage = async (req: ExtendedRequest, res: NextApiResponse) => {
    const {content, chatId} = req.body
    
    if(!content || !chatId) {
        console.log("Invalid Data passed into the request");
        res.status(400)
        throw new Error("Invalid Data passed into the request")
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {

        let message = await Message.create(newMessage)
        
        message = await message.populate("sender", "name email picture");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name picture email"
        });
        
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });

        res.status(200).json(message)

    } catch (error: any) {
        res.status(400)
        throw new Error(error.message)
    }

};


const allMessages = async (req: ExtendedRequest, res: NextApiResponse) => {

    try {
        const messages = await Message.find({chat: req.query.chatId}).populate("sender", "name picture email").populate("chat")
        res.status(200)
        res.json(messages)

    } catch (error: any) {
        res.status(400)
        throw new Error(error.message)
    }
};


export {
    sendMessage,
    allMessages
}