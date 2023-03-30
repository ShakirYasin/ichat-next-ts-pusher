import { useRouter } from "next/router";
import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react"
import { IUser, IChat, IMessage } from "../../types";
import axios from '../utils/axios'

export interface ChatContextInterface {
    user: IUser, 
    setUser: Dispatch<SetStateAction<IUser>>, 
    Logout: () => void, 
    selectedChat: IChat, 
    setSelectedChat: Dispatch<SetStateAction<IChat>>
    chats: IChat[], 
    setChats: Dispatch<SetStateAction<IChat[]>>, 
    notifications: IMessage[], 
    setNotifications: Dispatch<SetStateAction<IMessage[]>>
}

const ChatContext = createContext<ChatContextInterface>({} as ChatContextInterface);

const ChatProvider = ({children}: {children: React.ReactNode}) => {
    
    const [user, setUser] = useState<IUser | null>(null)
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
    const [chats, setChats] = useState<IChat[] | null>([])
    const [notifications, setNotifications] = useState<IMessage[] | null>([])
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
        console.log({axios});
    }, [axios])

    return <ChatContext.Provider value={{user, setUser, Logout, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications} as ChatContextInterface}>
        {children}
    </ChatContext.Provider>
}


export default ChatProvider

export const useChatContext = () => useContext(ChatContext)