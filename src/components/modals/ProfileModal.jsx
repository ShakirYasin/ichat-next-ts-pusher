import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, Center, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user, children}) => {

    const {isOpen, onOpen, onClose} = useDisclosure()

  return (
    <>
    {
        children ? (
            <Box as='span' onClick={onOpen}>{children}</Box>
        )
        :
        (
            <IconButton 
                display={{base: "flex"}}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
        )
    }
    
    <Modal size={"lg"} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h={"410px"}>
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={"2xl"}
          >{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDirection={"column"} h={"100%"}>
                <Image 
                    borderRadius={"full"}
                    boxSize={"150"}
                    src={user?.picture}
                    alt={user?.name}
                />
                <Text fontSize={"xl"} pt={"5"}>{user?.email}</Text>
            </Center>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal