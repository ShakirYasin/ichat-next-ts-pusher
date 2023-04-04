import { IUser } from '@/types'
import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box } from '@chakra-ui/react'
import React from 'react'

interface IProps {
  user: IUser;
  handleFn: () => void;
  isCurrentUser?: boolean
}

const UserBadge = ({user, handleFn, isCurrentUser}: IProps) => {

  const onClick = () => {
    if(!isCurrentUser)  {
      handleFn()
    } 
  }

  return (
    <Box>
        <Badge colorScheme={'teal'} variant={"solid"} rounded={"full"} px={3} py={1}>
            {isCurrentUser ? "You" : user?.name}
            <CloseIcon ml={3} boxSize={2.5} onClick={onClick} cursor={isCurrentUser ? "not-allowed" : "pointer"}/>
        </Badge>
    </Box>
  )
}

export default UserBadge