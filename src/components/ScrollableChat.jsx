import { Avatar, Badge, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isFirstMessageFromSender, isLastMessageFromSender } from '../config/chatLogics'
import { useChatContext } from '../Context/ChatProvider'

const ScrollableChat = ({messages}) => {
    const {user, selectedChat} = useChatContext()
    return (
    <ScrollableFeed className='scrollable-chat'>
        {messages?.length > 0 && messages?.map((message, i) => (
            <Box>
                {isFirstMessageFromSender(messages, i, user, selectedChat) && 
                    <Flex>
                        <Box width={8}></Box>
                        <Text pl={1} pb={1} fontSize={"12px"} color={"whiteAlpha.600"} >{message?.sender?.name}</Text>
                    </Flex>
                }
                <Flex gap={2}>
                    {isLastMessageFromSender(messages, i, user, selectedChat) ?
                        <Avatar src={message?.sender?.picture} boxSize={6} />
                        :
                        <Box boxSize={6}></Box>
                    }
                    <Box key={message?._id} display={"flex"} bg={user?._id === message?.sender?._id ? "teal" : "gray.600"} width={"max-content"} py={"7px"} px={3} maxWidth={"70%"} mb={2} rounded={10} ml={user?._id === message?.sender?._id ? "auto" : "0"}>
                        <Text fontSize={"14px"} fontWeight={"600"}>{message?.content}</Text>
                    </Box>
                </Flex>
            </Box>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat