import { useQuery, UseQueryOptions } from "react-query";
import { useChatContext } from "@/context/ChatProvider";
import axios from '@/utils/axios'
import { IChat, IMessage, IUser } from "types";

    
export const useSearch = (keyword = "", options: UseQueryOptions<IUser[], any, IUser[]>) => {
    return useQuery({
        queryKey: ['search', keyword],
        queryFn: async () => {
            const {data} = await axios.get(`/user?search=${keyword}`)
            return data
        },
        ...options
    })
}
    
export const useFetchChats = (options: UseQueryOptions<IChat[], unknown, IChat[]>) => {
    return useQuery<IChat[], unknown, IChat[]>({
        queryKey: ['chats'],
        queryFn: async () => {
            const {data} = await axios.get(`/chat`)
            return data
        },
        refetchOnWindowFocus: false,
        ...options
    })
}
    
export const useFetchMessages = (values: {chatId: string}, options: UseQueryOptions<IMessage[], unknown, IMessage[]>) => {
    const {selectedChat} = useChatContext()
    return useQuery({
        queryKey: ['messages', selectedChat?._id],
        queryFn: async () => {
            const {data} = await axios.get(`/message/${values?.chatId}`)
            return data
        },
        refetchOnWindowFocus: false,
        enabled: !!selectedChat?._id,
        
        ...options
    })
}