import {useMutation, useQueryClient} from "react-query"
import axios from "../utils/axios"
import {useChatContext} from "@/context/ChatProvider"

export const useSignUp = (options) => {
    const {setUser} = useChatContext()
    return useMutation(
        async (values) => {
            const {data} = await axios.post('/user', values);
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({RegisterResponse: data});
                setUser(data)
                axios.defaults.headers['Authorization'] = `Bearer ${data?.token}`
                options?.onSuccess?.(data);
            } 
        }
        )
    }
    
export const useLogin = (options) => {
    const {setUser} = useChatContext()
    return useMutation(
        async (values) => {
            const {data} = await axios.post('/user/login', values);
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({LoginResponse: data});
                setUser(data)
                axios.defaults.headers['Authorization'] = `Bearer ${data?.token}`
                options?.onSuccess?.(data);
            } 
        }
    )
}
    
export const useAccessChat = (options) => {
    const {setSelectedChat} = useChatContext()
    return useMutation(
        async ({userId}) => {
            const {data} = await axios.post('/chat', {userId});
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({AccessChatResponse: data});
                setSelectedChat(data)
                options?.onSuccess?.(data);
            },
            onError: (err) => {
                options?.onError?.(err);
            } 
        }
    )
}
    
export const useCreateGroupChat = (options) => {
    const {setSelectedChat, setChats} = useChatContext()
    return useMutation(
        async (values) => {
            const {data} = await axios.post('/chat/group', values);
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({CreateGroupChat: data});
                setChats(prev => [data, ...prev])
                setSelectedChat(data)
                options?.onSuccess?.(data);
            },
            onError: (err) => {
                options?.onError?.(err);
            } 
        }
    )
}
    
export const useRenameGroupChat = (options) => {
    const queryClient = useQueryClient()
    const {setSelectedChat} = useChatContext()
    return useMutation(
        async ({chatId, chatName}) => {
            const {data} = await axios.put('/chat/rename', {chatId, chatName});
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({RenamedChat: data});
                queryClient.invalidateQueries("chats")
                setSelectedChat(data)
                options?.onSuccess?.(data);
            },
            onError: (err) => {
                options?.onError?.(err);
            } 
        }
    )
}
    
export const useAddUserToGroup = (options) => {
    const queryClient = useQueryClient()
    const {setSelectedChat} = useChatContext()
    return useMutation(
        async ({chatId, userId}) => {
            const {data} = await axios.put('/chat/groupadd', {chatId, userId});
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({RenamedChat: data});
                queryClient.invalidateQueries("chats")
                setSelectedChat(data)
                options?.onSuccess?.(data);
            },
            onError: (err) => {
                options?.onError?.(err);
            } 
        }
    )
}
    
export const useRemoveUserFromGroup = (options) => {
    const queryClient = useQueryClient()
    const {setSelectedChat} = useChatContext()
    return useMutation(
        async ({chatId, userId}) => {
            const {data} = await axios.put('/chat/groupremove', {chatId, userId});
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                console.log({RenamedChat: data});
                queryClient.invalidateQueries("chats")
                // setSelectedChat(data)
                options?.onSuccess?.(data);
            },
            onError: (err) => {
                options?.onError?.(err);
            } 
        }
    )
}

   
export const useSendMessage = (options) => {
    const {setSelectedChat} = useChatContext()
    return useMutation(
        async (values) => {
            const {data} = await axios.post('/message', values);
            return data;
        },
        {
            ...options,
            onSuccess: (data) => {
                const latestMessage = {
                    ...data,
                    chat: data?.chat?._id
                }
                setSelectedChat(prev => ({
                    ...prev,
                    latestMessage
                }))
                options?.onSuccess?.(data);
            } 
        }
    )
}