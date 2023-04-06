import { useRouter } from "next/router";
import {createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState} from "react"
import { IUser, IChat, IMessage } from "../../types";
import axios from '../utils/axios'
import PusherClientInstance from "pusher-js"
import { Channel } from "pusher-js";


export interface ChatContextInterface {
    user: IUser, 
    setUser: Dispatch<SetStateAction<IUser>>, 
    Logout: () => void, 
    selectedChat: IChat, 
    setSelectedChat: Dispatch<SetStateAction<IChat | null>>
    chats: IChat[], 
    setChats: Dispatch<SetStateAction<IChat[]>>, 
    notifications: IMessage[], 
    setNotifications: Dispatch<SetStateAction<IMessage[]>>
    channel: Channel;
    pusherClient: PusherClientInstance
    setPusherClient: Function;
}

const ChatContext = createContext<ChatContextInterface>({} as ChatContextInterface);

const ChatProvider = ({children}: {children: React.ReactNode}) => {
    
    const [user, setUser] = useState<IUser | null>(null)
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
    const [chats, setChats] = useState<IChat[] | null>([])
    const [notifications, setNotifications] = useState<IMessage[] | null>([])
    const [pusherClient, setPusherClient] = useState<PusherClientInstance>({} as PusherClientInstance)
    
    // const pusherClient = useMemo<PusherClientInstance | null>(() => {
    //     if(user?.token) {
    //         console.log("Authorization in Context Pusher Memo: ", user?.token);
    //         return 
    //     }
    //     return null
    // }, [user?.token])

    const channel = useMemo(() => {
        if(selectedChat?._id && pusherClient) {
            return pusherClient.subscribe(selectedChat?._id as string)
        }
    }, [selectedChat?._id])
    const router = useRouter();

    const Logout = () => {
        localStorage.removeItem('iChat_user')
        setUser(null)
        router.push('/')
        setSelectedChat(null)
        setChats([])
    }

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('iChat_user') as string)
        if(!userInfo) {
            router.push('/')
        }else {
            setUser(userInfo)
            axios.defaults.headers['Authorization'] = `Bearer ${userInfo?.token}`
            router.push('/chat')
        }
    }, [])  

    useEffect(() => {
        if(!user?._id && pusherClient.disconnect) {
            return () => {
                pusherClient.disconnect()
            }
        }
    }, [user, pusherClient])
    
    useEffect(() => {
        console.log({pusherClient});
    }, [pusherClient])

    return <ChatContext.Provider value={{user, setUser, Logout, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications, channel, pusherClient, setPusherClient} as ChatContextInterface}>
        {children}
    </ChatContext.Provider>
}


export default ChatProvider

export const useChatContext = () => useContext(ChatContext)