import React from 'react'
import { useChatContext } from '../Context/ChatProvider'
import {Box} from "@chakra-ui/react"
import SingleChat from './SingleChat'

const ChatBox = () => {

  const {selectedChat} = useChatContext()

  return (
    <Box
      display={{base: selectedChat ? "flex" : "none", md: "flex"}}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      px={5}
      w={{base: "full", md: "70%", xl: "75%", "2xl": "83%"}}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChat  />
    </Box>
  )
}

export default ChatBox