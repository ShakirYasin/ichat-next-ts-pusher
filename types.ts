import { Types } from "mongoose"

export interface IUser {
    _id: string;
    name: string,
    email: string,
    picture: string,
}

export interface IUserModel extends IUser {
    password: string,
}

export interface IChat {
    _id: string;
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
    _id: string;
    sender: IUser,
    content:string,
    chat: IChat,
}

export interface IMessageModel {
    sender: Types.ObjectId,
    content:string,
    chat: Types.ObjectId,
}
