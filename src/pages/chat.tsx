import { Box, Flex } from '@chakra-ui/react';
import React from 'react'
import { useChatContext } from '@/Context/ChatProvider'
import Navbar from "@/components/layout/Navbar"
import MyChats from "@/components/MyChats"
import ChatBox from "@/components/ChatBox"
import { GetServerSidePropsContext } from 'next';

const Chat = () => {
 
  const {user} = useChatContext();

  return user && (
    <Box>
      <Navbar />
      <Flex justify={"space-between"} w={"100%"} h={"91.5vh"} p={"10px"} gap={5}>
        <MyChats />
        <ChatBox />
      </Flex>
    </Box>
  )
}


export default Chat