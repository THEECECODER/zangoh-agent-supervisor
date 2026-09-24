import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => (
  <Box minH="100vh" bg="canvas">
    <Header />
    <Sidebar />
    <Box as="main" pt="76px" pl={{base:0,md:'206px'}} minH="100vh">
      <Box px={{base:4,md:7}} py={5} maxW="1500px" mx="auto">{children}</Box>
    </Box>
  </Box>
);
export default Layout;