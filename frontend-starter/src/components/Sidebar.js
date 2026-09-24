import React from 'react';
import { Box, VStack, Flex, Text, Icon, Divider, Tooltip } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiSliders, FiFileText, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const location=useLocation();
  const items=[
    {name:'Dashboard',path:'/',icon:FiHome},
    {name:'Conversations',path:'/conversations',icon:FiMessageSquare},
    {name:'AI Agents',path:'/agent-config',icon:FiSliders},
    {name:'Templates',path:'/templates',icon:FiFileText}
  ];
  return (
    <Box position="fixed" top="58px" left={0} bottom={0} w="206px" bg="white" borderRight="1px solid" borderColor="gray.200" zIndex={20} display={{base:'none',md:'block'}} py={5}>
      <Text px={5} fontSize="10px" fontWeight="800" color="gray.400" letterSpacing="1px" mb={3}>WORKSPACE</Text>
      <VStack spacing={1} align="stretch" px={3}>
        {items.map(item=>{
          const active=location.pathname===item.path || (item.path==='/'&&location.pathname==='/');
          return <Box key={item.path} as={Link} to={item.path} px={3} py={2.5} borderRadius="7px" bg={active?'brand.50':'transparent'} color={active?'brand.700':'gray.600'} fontWeight={active?700:500} _hover={{bg:'gray.50'}}>
            <Flex align="center" gap={3}><Icon as={item.icon}/><Text fontSize="13px">{item.name}</Text></Flex>
          </Box>
        })}
      </VStack>
      <Divider my={6}/>
      <Text px={5} fontSize="10px" fontWeight="800" color="gray.400" letterSpacing="1px" mb={3}>SYSTEM</Text>
      <VStack spacing={1} align="stretch" px={3}>
        <Box px={3} py={2.5} borderRadius="7px" color="gray.600"><Flex align="center" gap={3}><Icon as={FiSettings}/><Text fontSize="13px">Settings</Text></Flex></Box>
      </VStack>
      <Box position="absolute" bottom={4} left={0} right={0} px={5}>
        <Flex align="center" gap={2} fontSize="11px" color="gray.400"><Box w="7px" h="7px" bg="green.400" borderRadius="full"/><Text>Systems operational</Text></Flex>
      </Box>
    </Box>
  );
};
export default Sidebar;