import { Types } from "mongoose"

export interface IUser {
    name: string,
    email: string,
    picture: string,
}

export interface IUserModel extends IUser {
    password: string,
}

export interface IChat {
    chatName: string,
    isGroup: boolean,
    groupImage: string,
    users: IUser[],
    latestMessage: IMessage,
    groupAdmin: IUser
}

export interface IChatModel {
    chatName: string,
    isGroup: boolean,
    groupImage: string,
    users: Types.ObjectId[],
    latestMessage: Types.ObjectId,
    groupAdmin: Types.ObjectId
}

export interface IMessage {
    sender: IUser,
    content:string,
    chat: IUser,
}

export interface IMessageModel {
    sender: Types.ObjectId,
    content:string,
    chat: Types.ObjectId,
}
