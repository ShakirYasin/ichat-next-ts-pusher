import React, { useEffect, useState } from 'react'
import { Box, Button, Center, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { useChatContext } from '../../Context/ChatProvider'
import { useSearch } from '../../../hooks/useQuery'
import { useAccessChat, useCreateGroupChat } from '../../../hooks/useMutation'
import ChatLoading from '../ChatLoading'
import UserListItem from '../User/UserListItem'
import useDebounce from '../../../hooks/useDebounce'
import UserBadge from '../User/UserBadge'
const GroupChatModal = ({children}) => {

  const {isOpen, onOpen, onClose} = useDisclosure()
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("")
  const toast = useToast()
  const { user, chats } = useChatContext();
  const debouncedSearch = useDebounce(search, 500)

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
  mutate: createGroupChat,
  isLoading: creatingChat,
} = useCreateGroupChat({
  onSuccess: (data) => {
    toast({
        title: "Created",
        description: "Chat created Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right"
    })
    close()
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
  }

})


const close = () => {
    onClose()
    setSearch("")
    setGroupChatName("")
    setSelectedUsers([])
    // setGo(false)
}

const handleGroup = (user) => {
  if(selectedUsers.find(item => item?._id === user?._id)) return
  
  setSelectedUsers([...selectedUsers, user])
}

const handleRemove = (user) => {
  setSelectedUsers(selectedUsers.filter(u => u._id !== user?._id))
}

const handleCreate = (e) => {
  e.preventDefault()
  if(!groupChatName) {

    toast({
      title: "Seriously!?",
      description: "Atleast Add a group Name bud!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-left",
      // colorScheme: "warning",
  })
    return;
  }

  if(selectedUsers.length < 2){
    toast({
        title: "Bruh!",
        description: "It's a group, Add more than 1 user, you Dummy!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
        // colorScheme: "warning",
    })
    return;
  }

  createGroupChat({
    name: groupChatName,
    users: selectedUsers
  })
}

  return (
    <>
      <Box as='span' onClick={() => {
        console.log("OPen");
        onOpen()
      }} p={0}>{children}</Box>
      <Modal size={"lg"} onClose={close} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent bg={"transparent"} shadow={"none"}>
            <ModalBody>
              <form onSubmit={handleCreate}>
                <Flex
                  direction={"column"}
                  gap={5}
                  >
                  <Input 
                      placeholder={'Enter Group Name'}
                      mr={2}
                      bg={"gray.700"}
                      border={"none"}
                      _focus={{
                          outline: "none",
                          shadow: "none"
                        }}
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                      p={6}
                      />
                  <Flex 
                    align={"center"}
                    bg={"gray.700"}
                    rounded={"md"}
                    px={6}
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
                      <Button isLoading={creatingChat} type='submit' display={selectedUsers?.length > 0 ? "flex" : "none"} bg={"teal"} _hover={{bg: "teal.500"}} _focus={{outline: "none", shadow: "none"}}>
                        Create
                      </Button>
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
                                    handleFn={() => handleGroup(user)}
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

export default GroupChatModal