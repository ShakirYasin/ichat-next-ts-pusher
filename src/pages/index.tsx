import { Box, Button, Center, Container, Heading, Input, InputGroup, InputRightElement, Stack, StackItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { LoginForm, SignUpForm } from '../components/Forms'
import { ChatContextInterface, useChatContext } from '../Context/ChatProvider'
import { useRouter } from 'next/router'

const Home = () => {

  const router = useRouter();
  const {user} = useChatContext()

  useEffect(() => {
      if(user) {
        router.push('/chat')
      }
  }, [user])

  return !user && (
    <Center width={'100%'} height={"100vh"}>
      <VStack spacing={6}>
        <Heading fontWeight={"600"} fontSize={"3xl"} textAlign={'center'} borderBottom={"2px solid teal"}>iChat</Heading>
        <Box 
          px={"20px"}
          borderRadius={"12px"}
          width={350}
        >
          <Tabs variant='line' isFitted colorScheme='teal'>
            <TabList>
              <Tab>Login</Tab>
              <Tab>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <LoginForm />
              </TabPanel>
              <TabPanel>
                <SignUpForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Center>
  )
}

export default Home