import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

interface IProps {
  vertCount: number, 
  cellHeight?: string;
}

const ChatLoading = ({vertCount, cellHeight}: IProps) => {
  return (
    <Stack>
        {Array.from(Array(vertCount).keys()).map(item => (
            <Skeleton key={item} height={cellHeight ?? "25px"} />
        ))}
    </Stack>
  )
}

export default ChatLoading