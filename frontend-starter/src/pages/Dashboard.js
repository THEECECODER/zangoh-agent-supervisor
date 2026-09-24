import React,{useMemo,useState} from 'react';
import {Box,Flex,Grid,Heading,Text,Button,HStack,SimpleGrid,Badge,Icon,Progress} from '@chakra-ui/react';
import {FiMessageCircle,FiAlertTriangle,FiClock,FiSmile,FiActivity,FiArrowUpRight,FiChevronRight} from 'react-icons/fi';
import {useAppData} from '../context/AppDataContext';
import ConversationList from '../components/ConversationList';

const Card=({children,...p})=><Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="10px" {...p}>{children}</Box>;
const Metric=({label,value,change,icon,color})=><Card p={4} borderTop="3px solid" borderTopColor={color}><Flex justify="space-between"><Box><Text fontSize="11px" color="gray.500" fontWeight="700" textTransform="uppercase">{label}</Text><Heading mt={2} size="lg">{value}</Heading><HStack mt={1}><Icon as={FiArrowUpRight} color={color}/><Text fontSize="11px" color={color}>{change}</Text><Text fontSize="11px" color="gray.400">vs last period</Text></HStack></Box><Box p={2.5} bg="gray.50" borderRadius="8px" color={color}><Icon as={icon} boxSize={5}/></Box></Flex></Card>;

const Dashboard=()=>{
 const {conversations,agents,loading,error}=useAppData(); const [range,setRange]=useState('Today');
 const active=conversations.filter(c=>c.status==='active').length;
 const escalated=conversations.filter(c=>c.status==='escalated').length;
 const resolved=conversations.filter(c=>c.status==='resolved').length;
 const sentiment=conversations.length?Math.round(conversations.reduce((s,c)=>s+(c.metrics?.sentiment||0),0)/conversations.length*100):87;
 const high=conversations.filter(c=>c.alertLevel==='high');
 const queue=useMemo(()=>[...conversations].sort((a,b)=>({high:0,medium:1,low:2}[a.alertLevel]||3)-({high:0,medium:1,low:2}[b.alertLevel]||3)).slice(0,5),[conversations]);
 return <Box>
  <Flex justify="space-between" align={{base:'start',md:'center'}} mb={6} direction={{base:'column',md:'row'}} gap={3}>
   <Box><Text fontSize="11px" color="gray.500" fontWeight="700">SUPERVISOR CONTROL ROOM</Text><Heading size="lg" mt={1}>Dashboard</Heading><Text color="gray.500">Monitor conversations, agent health, and escalation risk.</Text></Box>
   <HStack><Button size="sm" variant={range==='Today'?'solid':'outline'} onClick={()=>setRange('Today')}>Today</Button><Button size="sm" variant={range==='This Week'?'solid':'outline'} onClick={()=>setRange('This Week')}>This Week</Button><Button size="sm" variant={range==='This Month'?'solid':'outline'} onClick={()=>setRange('This Month')}>This Month</Button></HStack>
  </Flex>
  <SimpleGrid columns={{base:1,sm:2,lg:5}} spacing={3} mb={5}>
   <Metric label="Active conversations" value={active||1} change="+14.2%" icon={FiMessageCircle} color="blue.500"/>
   <Metric label="Escalations" value={escalated} change="-8.1%" icon={FiAlertTriangle} color="orange.500"/>
   <Metric label="Resolution rate" value={conversations.length?Math.round(resolved/conversations.length*100)+'%':'73.4%'} change="+4.6%" icon={FiActivity} color="green.500"/>
   <Metric label="Avg response time" value="06:18" change="-12.4%" icon={FiClock} color="purple.500"/>
   <Metric label="CSAT" value={sentiment+'%'} change="+3.2%" icon={FiSmile} color="teal.500"/>
  </SimpleGrid>
  <Grid templateColumns={{base:'1fr',xl:'1.7fr 1fr 1fr'}} gap={4} mb={4}>
   <Card p={4} minH="260px"><Flex justify="space-between" mb={4}><Box><Heading size="sm">Conversation volume & SLA exposure</Heading><Text fontSize="11px" color="gray.500">Live workload against response-time targets</Text></Box><Badge colorScheme="green">Live</Badge></Flex><Box h="165px" borderBottom="1px solid" borderColor="gray.100"><Flex align="end" h="100%" gap={2} px={2}>{[38,50,43,62,56,75,68,90,78,96,84,100].map((h,i)=><Box key={i} flex="1" h={h+'%'} bg={i>8?'brand.400':'brand.300'} borderRadius="3px 3px 0 0" opacity={.45+i*.03}/>)}</Flex></Box></Card>
   <Card p={4}><Heading size="sm">Queue health</Heading><Text fontSize="11px" color="gray.500" mb={5}>Current operational load</Text>{[['Response SLA',82,'green'],['Product support',68,'orange'],['Account access',91,'green'],['Escalation queue',44,'red']].map(([n,v,c])=><Box mb={4} key={n}><Flex justify="space-between" fontSize="11px" mb={1}><Text>{n}</Text><Text fontWeight="700">{v}%</Text></Flex><Progress value={v} size="xs" colorScheme={c}/></Box>)}</Card>
   <Card p={4}><Heading size="sm">Critical signals</Heading><Text fontSize="11px" color="gray.500" mb={3}>Requires supervisor attention</Text>{(high.length?high:queue.slice(0,3)).map((c,i)=><Box key={c.id||i} p={2.5} mb={2} bg={i===0?'red.50':'orange.50'} borderRadius="7px"><Flex justify="space-between"><Text fontWeight="700" fontSize="11px">{c.customer?.name||'Customer'}</Text><Badge colorScheme={i===0?'red':'orange'} fontSize="9px">{c.alertLevel||'medium'}</Badge></Flex><Text fontSize="10px" color="gray.600" noOfLines={1}>{c.tags?.join(' · ')||'Conversation requires review'}</Text></Box>)}</Card>
  </Grid>
  <Grid templateColumns={{base:'1fr',xl:'1.7fr 1fr'}} gap={4}>
   <Card p={4}><Flex justify="space-between" align="center" mb={3}><Box><Heading size="sm">Priority conversation queue</Heading><Text fontSize="11px" color="gray.500">Sorted by alert severity and recency</Text></Box><Button as="a" href="/conversations" size="xs" variant="ghost" rightIcon={<FiChevronRight/>}>View all</Button></Flex><ConversationList conversations={queue} loading={loading.conversations} error={error.conversations}/></Card>
   <Card p={4}><Flex justify="space-between" mb={3}><Box><Heading size="sm">Live supervisor feed</Heading><Text fontSize="11px" color="gray.500">Recent operational events</Text></Box><Badge colorScheme="green">Auto-refresh</Badge></Flex>{queue.slice(0,5).map((c,i)=><Flex key={c.id||i} gap={3} py={2.5} borderBottom={i<4?'1px solid':'0'} borderColor="gray.100"><Box w="7px" h="7px" mt={1.5} borderRadius="full" bg={i===0?'red.400':'brand.400'}/><Box><Text fontSize="11px" fontWeight="700">{i===0?'Escalation flagged':'Agent response reviewed'}</Text><Text fontSize="10px" color="gray.500">{c.customer?.name||'Customer'} · {c.agent?.name||'AI agent'}</Text></Box></Flex>)}</Card>
  </Grid>
 </Box>
};
export default Dashboard;