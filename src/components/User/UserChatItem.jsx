import { Avatar, Badge, Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { getSender } from '../../config/chatLogics'
import { useChatContext } from '../../Context/ChatProvider'

const UserChatItem = ({chat, handleFn}) => {
    
    const {user, selectedChat, notifications} = useChatContext()

  return (
    <Flex
        align={"center"}
        overflow={'hidden'}
        gap={4}
        onClick={handleFn}
        mt={"0!important"}
        cursor={"pointer"}
        bg={selectedChat?._id === chat?._id ? "whiteAlpha.200" : "transparent"}
        borderBottomWidth={selectedChat?._id === chat?._id  ? 1 : 0}
        borderBottomColor={selectedChat?._id === chat?._id ? "teal.800" : "whiteAlpha.300"}
        borderRightWidth={selectedChat?._id === chat?._id ? 6 : 0}
        borderRightColor={selectedChat?._id === chat?._id ? "teal" : "whiteAlpha.300"}
        color={"white"}
        px={3}
        py={3}
        key={chat._id}
        >
            <Avatar 
                src={chat?.isGroup ? chat?.groupImage : getSender(user, chat.users)?.picture}
                name={user?.name}
                width={55}
                height={55}
                borderWidth={3}
                borderColor={selectedChat?._id === chat?._id ? "teal.500" : "whiteAlpha.300"}
                borderStyle={"solid"}
                bg={"whiteAlpha.700"}
            />
            <Box flexGrow={1}>
                <Text ml={selectedChat?._id === chat?._id ? 2 : 0} transition={"margin 0.15s ease-in-out"} color={selectedChat?._id === chat?._id ? "teal.300" : ""} >
                    {!chat.isGroup ? (
                    getSender(user, chat.users)?.name
                    ) : ( chat.chatName )}
                </Text>
            </Box>
            {
                notifications?.find((n) => n.chat._id === chat?._id) &&
                <Badge bg={"teal"} width={"18px"} height={"18px"} display={'flex'} alignItems={'center'} justifyContent={"center"} textAlign={"center"} rounded={"2xl"} fontWeight={"600"}>{notifications?.filter((n) => n.chat._id === chat?._id)?.length}</Badge>
            }
    </Flex>
  )
}

export default UserChatItem