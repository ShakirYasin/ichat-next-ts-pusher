import { IUser } from '@/types'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

interface IProps {
    user: IUser;
    handleFn: () => void;
    users: IUser[];
    i: number
}

const UserListItem = ({user, handleFn, users, i}: IProps) => {
  return (
    <Flex
        onClick={handleFn}
        align={'center'}
        cursor={"pointer"}
        // bg={'teal.300'}
        _hover={{
            bg: 'teal',
            color: "white"
        }}
        w={"full"}
        px={3}
        py={2}
        mb={i+1 === users?.length ? 0 : 2}
        borderRadius={"lg"}
        gap={2}
    >
        <Avatar 
            src={user?.picture}
            size={"sm"}
            cursor={"pointer"}
            name={user?.name}
        />
        <Box>
            <Text>{user?.name}</Text>
            <Text fontSize={"xs"}>
                <Text as={'span'} fontWeight={"600"}>Email: </Text> 
                {user?.email}
            </Text>
        </Box>
    </Flex>
  )
}

export default UserListItem