import React, { useEffect, useState } from 'react'
import {Avatar, Badge, Box, Button, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure} from '@chakra-ui/react'
import {BellIcon, Search2Icon, ChevronDownIcon} from '@chakra-ui/icons'
import {useChatContext} from "../../Context/ChatProvider"
import ProfileModal from '../modals/ProfileModal'
import SideDrawer from '../SideDrawer'
import SearchModal from '../modals/SearchModal'
import {getSender} from "../../config/chatLogics"

const Navbar = () => {
  const {user, Logout, notifications, setNotifications, setSelectedChat} = useChatContext()
  const {isOpen, onOpen, onClose} = useDisclosure()
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        onOpen()
      }
    };
    window.addEventListener('keydown', keyDownHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }

  }, [])

  return (
    <>
      <Flex align={"center"} justify={"space-between"} p={"5px 10px"}>
        <SearchModal isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <Tooltip label="Search Users to Chat" hasArrow variant={""} placement='bottom'>
            <Button variant={"solid"}>
              <Search2Icon />
              <Text display={{base: "none", md: "flex"}} px={"4"}>Search User</Text>
              <Text fontSize={"12px"} opacity={0.5} ml={5}>Ctrl + K</Text>
            </Button>
          </Tooltip>
        </SearchModal>
        <Text fontSize={"2xl"} color={"teal.300"}>iChat</Text>
        <Box>
          <Menu>
            <MenuButton p={"1"}>
              <Box position={"relative"}>
                <BellIcon fontSize={"2xl"} />
                {
                  notifications?.length > 0 &&
                  <Badge position={"absolute"} top={-1} left={-1} zIndex={2} bg={"teal"} width={"18px"} height={"18px"} rounded={"2xl"} fontWeight={"600"}>{notifications?.length}</Badge>
                }
              </Box>
            </MenuButton>
            <MenuList p={1}>
              {!notifications?.length > 0 && <Text p={2}>No New Messages</Text>}
              {notifications?.map(notification => {
                console.log(getSender(user, notification?.chat?.users));
                return (
                <MenuItem key={notification?._id} mb={1} onClick={() => {
                  setSelectedChat(notification?.chat)
                  setNotifications(notifications.filter((n) => n?.chat?._id !== notification?.chat?._id))
                }}>
                  {notification?.chat?.isGroup ? 
                    <Flex gap={3} align={"flex-start"} maxWidth={230}>
                      <Avatar src={notification?.chat?.groupImage} width={30} height={30} bg={"whiteAlpha.800"} />
                      <Box maxWidth={"100%"} overflow={"hidden"}>
                        <Text fontWeight={"300"} fontSize={"12px"} lineHeight={"15px"}>{notification?.chat?.chatName}</Text>
                        <Flex gap={2}>
                          <Text fontWeight={"600"} fontSize={"14px"} lineHeight={"15px"} mt={1}>{notification?.sender?.name}:</Text>
                          <Text fontWeight={"400"} fontSize={"14px"} color={"whiteAlpha.700"} lineHeight={"15px"} mt={1} isTruncated> {notification?.content}</Text>
                        </Flex>
                      </Box>
                    </Flex> 
                    : 
                    <Flex gap={3} align={"flex-start"} maxWidth={230}>
                      <Avatar src={getSender(user, notification?.chat?.users)?.picture} width={30} height={30} />
                      <Box maxWidth={"100%"} overflow={"hidden"}>
                        <Text fontWeight={"600"} fontSize={"14px"} lineHeight={"15px"}>{getSender(user, notification?.chat?.users)?.name}</Text>
                        <Text fontWeight={"400"} fontSize={"14px"} color={"whiteAlpha.700"} lineHeight={"15px"} mt={1} isTruncated>{notification?.content}</Text>
                      </Box>
                    </Flex>
                  }
                </MenuItem>
              )})}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar 
                size={'sm'}
                cursor={"pointer"}
                name={user?.name}
                bg={"teal.300"}
                fontWeight={"600"}
                src={user?.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider /> 
              <MenuItem onClick={Logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </>
  )
}

export default Navbar