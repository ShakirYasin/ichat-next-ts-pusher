import { useQuery } from "react-query";
import { useChatContext } from "../src/Context/ChatProvider";
import axios from '../utils/axios'

    
export const useSearch = (keyword = "", options) => {
    return useQuery({
        queryKey: ['search', keyword],
        queryFn: async () => {
            const {data} = await axios.get(`/user?search=${keyword}`)
            return data
        },
        ...options
    })
}
    
export const useFetchChats = (options) => {
    return useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const {data} = await axios.get(`/chat`)
            return data
        },
        refetchOnWindowFocus: false,
        ...options
    })
}
    
export const useFetchMessages = (values, options) => {
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