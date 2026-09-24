import React from 'react';
import {ChakraProvider,Box,ColorModeScript} from '@chakra-ui/react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AgentConfig from './pages/AgentConfig';
import ConversationView from './pages/ConversationView';
import Analysis from './pages/Analysis';
import Templates from './pages/Templates';
import {WebSocketProvider} from './context/WebSocketContext';
import {AppDataProvider} from './context/AppDataContext';

function App(){return <ChakraProvider theme={theme}><ColorModeScript initialColorMode={theme.config.initialColorMode}/><WebSocketProvider><AppDataProvider><Router><Box minH="100vh"><Layout><Routes><Route path="/" element={<Dashboard/>}/><Route path="/conversations" element={<ConversationView/>}/><Route path="/conversation/:id" element={<ConversationView/>}/><Route path="/agent-config" element={<AgentConfig/>}/><Route path="/templates" element={<Templates/>}/><Route path="/Analysis" element={<Analysis/>}/></Routes></Layout></Box></Router></AppDataProvider></WebSocketProvider></ChakraProvider>}
export default App;