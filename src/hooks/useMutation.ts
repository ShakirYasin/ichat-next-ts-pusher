import {useMutation, UseMutationOptions, useQueryClient} from "react-query"
import axios from "../utils/axios"
import {useChatContext} from "@/context/ChatProvider"
import { unknown } from "zod"

export const useSignUp = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            } 
        }
        )
    }
    
export const useLogin = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            } 
        }
    )
}
    
export const useAccessChat = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            },
            onError: (err) => {
                options?.onError?.(err, unknown, unknown);
            } 
        }
    )
}
    
export const useCreateGroupChat = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            },
            onError: (err) => {
                options?.onError?.(err, unknown, unknown);
            } 
        }
    )
}
    
export const useRenameGroupChat = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data,unknown,unknown);
            },
            onError: (err) => {
                options?.onError?.(err, unknown, unknown);
            } 
        }
    )
}
    
export const useAddUserToGroup = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            },
            onError: (err) => {
                options?.onError?.(err, unknown, unknown);
            } 
        }
    )
}
    
export const useRemoveUserFromGroup = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            },
            onError: (err) => {
                options?.onError?.(err, unknown, unknown);
            } 
        }
    )
}

   
export const useSendMessage = (options: UseMutationOptions<unknown, unknown, unknown>) => {
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
                options?.onSuccess?.(data, unknown, unknown);
            } 
        }
    )
}