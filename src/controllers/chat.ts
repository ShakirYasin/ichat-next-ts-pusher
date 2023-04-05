import type { NextApiRequest, NextApiResponse } from 'next'
import User from "../models/userModel"
import Chat from "../models/chatModel"
import Message from "../models/messageModel"

const accessChat = async (req: NextApiRequest, res: NextApiResponse) => {
    const {userId} = req.body;

    if(!userId) {
        console.log("User Id param not sent with request");
        return res.status(400)
    }

    let isChat = await Chat.find({
        isGroup: false,
        $and: [
            {users: { $elemMatch: {$eq: req.user._id} }},
            {users: { $elemMatch: {$eq: userId} }},
        ]
    }).populate('users', "-password").populate('latestMessage')

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })


    if(isChat.length > 0) {
        res.json(isChat[0])
    }
    else {
        let chatData = {
            chatName: 'sender',
            isGroup: false,
            users: [req.user.id, userId]
        }

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password")

            res.status(200).json(FullChat)

        } catch (error: any) {
            res.status(400)
            throw new Error(error.message)
        }
    }
}

const fetchChats = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let chat = await Chat.find({users: { $elemMatch: { $eq: req.user._id } }})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .sort({updatedAt: -1})

        chat = await Message.populate(chat, {
            path: "latestMessage",
        })
        chat = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "name email picture"
        })

       return res.status(200).json(chat)
    
    } catch (error: any) {
        res.status(400)
        throw new Error(error.message)
    }
}


const createGroupChat = async (req: NextApiRequest, res: NextApiResponse) => {
    const {users, name} = req.body;
    if(!name || !users) {
        return res.status(400).send({message: "Please Fill all the Fields."})
    }

    if(users.length < 2) {
        return res.status(400).send("More then 2 users are required to form a group chat.");
    }

    users.push(req.user);
    try {
        const groupChat = await Chat.create({
            chatName: name,
            users: users,
            isGroup: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

}

const renameGroup = async (req: NextApiRequest, res: NextApiResponse) => {
    const {chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatedChat) {
        res.status(404)
        throw new Error('Chat Not Found')
    }
    else {
        res.status(200).json(updatedChat)
    }

}


const addToGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
           $push: { users: userId }, 
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added) {
        res.status(404)
        throw new Error('Chat Not Found')
    }
    else {
        res.status(200).json(added)
    }
}

const removeFromGroup = async(req: NextApiRequest, res: NextApiResponse) => {
    const {chatId, userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
           $pull: { users: userId }, 
        },
        {
            new: true
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!removed) {
        res.status(404)
        throw new Error('Chat Not Found')
    }
    else {
        res.status(200).json(removed)
    }
}

export {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}