import React, { useEffect, useState } from 'react'
import { Box, Button, Center, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { useChatContext } from '../../Context/ChatProvider'
import { useSearch } from '../../../hooks/useQuery'
import { useAccessChat } from '../../../hooks/useMutation'
import ChatLoading from '../ChatLoading'
import UserListItem from '../User/UserListItem'
import useDebounce from '../../../hooks/useDebounce'


const SearchModal = ({children, isOpen, onOpen, onClose}) => {

    
    const [search, setSearch] = useState('')
    const [go, setGo] = useState(false)
    const toast  = useToast()
    const debouncedSearch = useDebounce(search, 500)
    const {chats, setChats, setSelectedChat} = useChatContext()

    const {data: users, isLoading} = useSearch(debouncedSearch, {
        enabled: debouncedSearch !== "",
        onSuccess: (data) => {
            console.log({users: data});
            // setGo(false)
        },
        onError: () => {
            // setGo(false)
        },
    })

    const {
        mutate: mutateAccessChat,
        isLoading: accessingChat
    } = useAccessChat({
        onSuccess: (data) => {
            if(!chats?.find((c) => c._id === data._id)) {
                setChats(prev => [data, ...prev])
            }
            // else {
            //     const filtered = chats.filter(c => c?._id !== data?._id)
            //     setChats([data, ...filtered])
            // }
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
    
    // const handleSearch = () => {
    //     if(!search) {
    //         toast({
    //             title: "Yo!",
    //             description: "Please Enter Something in Search",
    //             status: "warning",
    //             duration: 5000,
    //             isClosable: true,
    //             position: "top-left"  
    //         })        
    //         return;
    //     } 
    //     // setGo(true)
    // }

    const accessChat = (id) => {
        mutateAccessChat({
            userId: id
        })
        onClose()
        setSearch("")
    }

    const close = () => {
        onClose()
        setSearch("")
        // setGo(false)
    }


    
  return (
    <>
      <Box as='span' onClick={onOpen} p={0}>{children}</Box>
      <Modal size={"lg"} onClose={close} isOpen={isOpen} >
        <ModalOverlay />
        <ModalContent shadow={"none"}>
            <ModalBody>
                <Flex align={"center"} mb={users?.length > 0 ? 5 : 0}>
                    <Search2Icon color={"teal"} boxSize={25} />
                    <Input 
                        placeholder={'Search by name or email'}
                        mr={2}
                        border={"none"}
                        _focus={{
                            outline: "none",
                            shadow: "none"
                        }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        // onKeyDown={(e) => {
                        //     if(e.key === 'Enter') handleSearch()
                        // }}
                    />
                    {/* <Button onClick={handleSearch}>Go</Button> */}
                </Flex>
                {
                    isLoading ? 
                    <ChatLoading vertCount={3} />
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
            </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SearchModal