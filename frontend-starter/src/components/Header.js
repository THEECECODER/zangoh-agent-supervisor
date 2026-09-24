import React from 'react';
import { Box, Flex, IconButton, Input, InputGroup, InputLeftElement, Avatar, Text, Badge, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FiSearch, FiMenu, FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { useColorMode } from '@chakra-ui/react';

const Header = () => {
  const {colorMode,toggleColorMode}=useColorMode();
  return (
    <Box position="fixed" top={0} left={0} right={0} h="58px" bg="brand.700" color="white" zIndex={30} boxShadow="0 1px 0 rgba(0,0,0,.08)">
      <Flex h="100%" align="center" px={{base:4,md:6}} gap={5}>
        <Flex w={{base:'auto',md:'206px'}} align="center" gap={3}>
          <IconButton display={{base:'flex',md:'none'}} aria-label="menu" icon={<FiMenu/>} variant="ghost" color="white"/>
          <Text fontWeight="800" letterSpacing=".2px">ABC Company</Text>
        </Flex>
        <InputGroup maxW="330px" display={{base:'none',md:'flex'}}>
          <InputLeftElement><FiSearch/></InputLeftElement>
          <Input placeholder="Search conversations, agents..." bg="rgba(255,255,255,.10)" border="1px solid rgba(255,255,255,.18)" color="white" _placeholder={{color:'purple.100'}} _focus={{bg:'white',color:'gray.800'}}/>
        </InputGroup>
        <Flex ml="auto" align="center" gap={1}>
          <IconButton aria-label="theme" icon={colorMode==='light'?<FiMoon/>:<FiSun/>} variant="ghost" color="white" onClick={toggleColorMode}/>
          <Box position="relative">
            <IconButton aria-label="notifications" icon={<FiBell/>} variant="ghost" color="white"/>
            <Badge position="absolute" top="0" right="-1" borderRadius="full" bg="red.400" color="white" fontSize="10px" px={1.5}>3</Badge>
          </Box>
          <Menu>
            <MenuButton px={3} py={2} fontWeight="700" _hover={{bg:'rgba(255,255,255,.08)'}} borderRadius="md">
              <Flex align="center" gap={2}><Text>Supervisor</Text><Avatar size="xs" name="Supervisor"/></Flex>
            </MenuButton>
            <MenuList color="gray.800"><MenuItem>Profile</MenuItem><MenuItem>Settings</MenuItem><MenuItem>Sign out</MenuItem></MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};
export default Header;