import { DownloadIcon, Search2Icon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Modal, ModalBody, ModalContent, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useDebounce from '../../../hooks/useDebounce'
import { useAddUserToGroup, useCreateGroupChat, useRemoveUserFromGroup, useRenameGroupChat } from '../../../hooks/useMutation'
import { useSearch } from '../../../hooks/useQuery'
import { useChatContext } from '../../Context/ChatProvider'
import ChatLoading from '../ChatLoading'
import UserBadge from '../User/UserBadge'
import UserListItem from '../User/UserListItem'


const UpdateGroupChatModal = ({children}) => {

  const {isOpen, onOpen, onClose} = useDisclosure()
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("")
  const toast = useToast()
  const { user: currentUser, chats, selectedChat, setSelectedChat } = useChatContext();
  const debouncedSearch = useDebounce(search, 500)

  const {data: users, isLoading} = useSearch(debouncedSearch, {
    enabled: debouncedSearch !== "",
    onSuccess: (data) => {
        console.log({users: data});
    },
    onError: (err) => {
        toast({
            title: "Error",
            description: err?.response?.data?.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right"    
        })
    },
})

const {
    mutate: renameChat,
    isLoading: renamingChat
} = useRenameGroupChat({
    onSuccess: () => {
        toast({
            title: "Successfull",
            description: "Group renamed",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right"    
        })
    }
})

const {
    mutate: addToGroup,
    isLoading: addingToGroup,
} = useAddUserToGroup({
    onSuccess: () => {
        toast({
            title: "Successfull",
            description: "User Added",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right"    
        })
    }
})

const {
    mutate: removeFromGroup,
    isLoading: removingFromGroup,
    data
} = useRemoveUserFromGroup({
    onSuccess: (data) => {
        if(data?.users?.find(user => user?._id === currentUser?._id)) {
            toast({
                title: "Successfull",
                description: "User Removed",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom-right"    
            })
        }
    }
})


const close = () => {
    onClose()
    setSearch("")
    setGroupChatName("")
    setSelectedUsers([])
    // setGo(false)
}

const handleAddUser = (user) => {
    if(selectedUsers.find(item => item?._id === user?._id)) {
        toast({
            title: "Bruh!",
            description: "User is already in the group...",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-right"    
        })
        return
    }
    if(selectedChat.groupAdmin?._id !== currentUser?._id) {
        toast({
            title: "DUDE!",
            description: "Only Admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right"    
        })
        return
    }

    addToGroup({
        chatId: selectedChat?._id,
        userId: user?._id
    })
}

const handleRename = () => {
    renameChat({
        chatId: selectedChat?._id,
        chatName: groupChatName,
    })
}

const handleRemove = (user) => {
    if(selectedChat.groupAdmin?._id !== currentUser?._id && user?._id !== currentUser?._id) {
        toast({
            title: "DUDE!",
            description: "Only Admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right"    
        })
        return
    }

    removeFromGroup({
        chatId: selectedChat?._id,
        userId: user?._id
    })

    user?._id === currentUser?._id ? setSelectedChat(null) : setSelectedChat(data)
}

useEffect(() => {
    setGroupChatName(selectedChat?.chatName)
    setSelectedUsers(selectedChat?.users)
}, [selectedChat, isOpen])

  return (
    <>
      <Box as='span' onClick={() => {
        onOpen()
      }} p={0}>{children}</Box>
      <Modal size={"lg"} onClose={close} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent bg={"transparent"} shadow={"none"}>
            <ModalBody>
              <form>
                <Flex
                  direction={"column"}
                  gap={5}
                  >
                    <Box alignSelf={"flex-end"}>
                        <Button bg={'red'} _hover={{bg: "red"}} onClick={() => handleRemove(currentUser)}>
                            <DownloadIcon transform={"rotateZ(90deg)"} />
                            <Text ml={2}>Leave</Text>
                        </Button>
                    </Box>
                    <Flex 
                        align={"center"}
                        bg={"gray.700"}
                        rounded={"md"}
                        pr={2}
                    >
                        <Input 
                            placeholder={'Enter Group Name'}
                            mr={2}
                            border={"none"}
                            _focus={{
                                outline: "none",
                                shadow: "none"
                                }}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                            p={6}
                        />
                        <Button isLoading={renamingChat} fontSize={"sm"} display={selectedUsers?.length > 0 ? "flex" : "none"} bg={"teal"} _hover={{bg: "teal.500"}} _focus={{outline: "none", shadow: "none"}} onClick={handleRename} >
                            Rename
                        </Button>
                    </Flex>
                  <Flex 
                    align={"center"}
                    bg={"gray.700"}
                    rounded={"md"}
                    pl={6}
                    pr={2}
                    py={1.5}
                    >
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
                      />
                      {(addingToGroup || removingFromGroup) && <Spinner boxSize={19} />}
                  </Flex>
                  <Box
                    display={selectedUsers.length > 0 ? "flex" : "none"}
                    gap={2}
                  >
                    {selectedUsers.map(user => (
                      <UserBadge 
                        key={user?._id}
                        user={user}
                        handleFn={() => handleRemove(user)}
                        isCurrentUser={user?._id === currentUser?._id}
                      />
                    ))}
                  </Box>
                  <Box
                    display={users?.length > 0 ? "block" : "none"}
                    bg={'gray.700'}
                    rounded={"md"}
                    py={2}
                    px={3}
                  >
                    {
                        isLoading ? 
                        <ChatLoading vertCount={3} />
                        :
                        (
                            users?.map((user, i) => (
                                <UserListItem
                                    key={user?._id}
                                    user={user}
                                    handleFn={() => handleAddUser(user)}
                                    users={users}
                                    i={i}
                                />
                            ))
                        )
                    }
                  </Box>
                </Flex>
              </form>
            </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal