import { IChat, IMessage, IUser } from "types"

export const getSender = (loggedUser: IUser, users: IUser[]) => {
    return users[0]._id === loggedUser?._id ? users[1] : users[0] 
}

export const isLastMessageFromSender = (messages: IMessage[], i: number, me: IUser, chat: IChat) => {
    return chat?.isGroup && messages[i]?.sender?._id !== me?._id && messages[i+1]?.sender?._id !== messages[i]?.sender?._id
}

export const isFirstMessageFromSender = (messages: IMessage[], i: number, me: IUser, chat: IChat) => {
    return chat?.isGroup && messages[i]?.sender?._id !== me?._id && messages[i-1]?.sender?._id !== messages[i]?.sender?._id
}