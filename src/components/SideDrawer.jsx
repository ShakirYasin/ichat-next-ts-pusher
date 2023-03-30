import { Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Input, Spinner, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import useDebounce from "../../hooks/useDebounce"
import { useSearch } from '../../hooks/useQuery'
import { useAccessChat } from '../../hooks/useMutation'
import ChatLoading from './ChatLoading'
import UserListItem from "./User/UserListItem"
import { useChatContext } from '../Context/ChatProvider'


const SideDrawer = ({onClose, isOpen}) => {
    const [search, setSearch] = useState('')
    const [go, setGo] = useState(false)
    const toast  = useToast()
    const {chats, setChats} = useChatContext()

    const {data: users, isFetching} = useSearch(search, {
        enabled: go,
        onSuccess: (data) => {
            console.log({users: data});
            setGo(false)
        },
        onError: () => {
            setGo(false)
        },
    })

    const {
        mutate: mutateAccessChat,
        isLoading: accessingChat
    } = useAccessChat({
        onSuccess: (data) => {
            if(!chats?.find((c) => c._id === data._id)) setChats(prev => [data, ...prev])
        },
        onError: (err) => {
            toast({
                title: "Error!",
                description: "Error Fecthing the Chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"  
            })  
        }
    })
    
    const handleSearch = () => {
        if(!search) {
            toast({
                title: "Yo!",
                description: "Please Enter Something in Search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"  
            })        
            return;
        } 
        setGo(true)
    }

    const accessChat = (id) => {
        mutateAccessChat({
            userId: id
        })
        onClose()
        setSearch("")
    }

    return (
    <Drawer
        placement='left'
        onClose={onClose}
        isOpen={isOpen}
        size={"sm"}
    >
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
            <DrawerBody>
                <Flex pb={'2'}>
                    <Input 
                        placeholder={'Search by name or email'}
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') handleSearch()
                        }}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                </Flex>
                {
                    isFetching ? 
                    <ChatLoading vertCount={10} />
                    :
                    (
                        users?.map(user => (
                            <UserListItem
                                key={user?._id}
                                user={user}
                                handleFn={() => accessChat(user?._id)}
                            />
                        ))
                    )
                }
                {accessingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
        </DrawerContent>
    </Drawer>
  )
}

export default SideDrawer