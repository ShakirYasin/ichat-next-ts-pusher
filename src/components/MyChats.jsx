import { AddIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useFetchChats } from '../../hooks/useQuery'
import { getSender } from '../config/chatLogics'
import { useChatContext } from '../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import GroupChatModal from './modals/GroupChatModal'
import UserChatItem from './User/UserChatItem'


const MyChats = () => {
  const {selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications} = useChatContext()
  const [loggedUser, setLoggedUser] = useState(null)
  const toast = useToast();
  const {
    isLoading
  } = useFetchChats({
    onSuccess: (data) => {
      setChats(data)
    },
    onError: (err) => {
      toast({
          title: "Error!",
          description: "Failed to load chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left"  
        })  
    }
  })

  const handleNotification = (chat) => {
    setNotifications(notifications.filter((n) => n?.chat?._id !== chat?._id))
  }


  return (
    <Box
      display={{base: selectedChat ? "none" : "flex", md: "flex"}}
      flexDir={"column"}
      py={3}
      w={{base: "full", md: "30%", xl: "25%", "2xl": "17%"}}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Flex
        columnGap={3}
        pb={3}
        px={6}
        borderBottomWidth={1}
      >
        <Text
          w={"full"}
          fontSize={{base: "28px", md: '30px'}}
        >
          My Chats
        </Text>
        <Menu>
          <MenuButton as={Button}>
            <HamburgerIcon />
          </MenuButton>
          <MenuList
            py={0}
            >
              <GroupChatModal>
                <MenuItem
                  icon={<AddIcon />}
                  py={3}
                  >
                  New Group Chat
                </MenuItem>
              </GroupChatModal>
          </MenuList>
        </Menu>
      </Flex>

      <Flex
        direction={"column"}
        py={3}
        w={"full"}
        h={"full"}
        borderRadius={"lg"}
        overflowY={"hidden"}
        gap={0}
      >
        {
          isLoading ? 
          (
            <Box px={3}>
              <ChatLoading vertCount={5} cellHeight={"35px"} />
            </Box>
          )
          :
          !chats.length ? 
            <Text align={"center"} color={"whiteAlpha.700"}>Chats Not Found</Text>
          : (
            <Stack overflowY={"auto"}>
                {chats.map(chat => (
                  <UserChatItem 
                    handleFn={() => {
                      setSelectedChat(chat)
                      handleNotification(chat)
                    }}
                    chat={chat}
                    key={chat?._id}
                  />
                ))}
            </Stack>
        )}
      </Flex>
    </Box>
  )
}

export default MyChats