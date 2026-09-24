import React,{useEffect,useMemo,useState} from 'react';
import {Box,Flex,Grid,Heading,Text,Button,HStack,SimpleGrid,Badge,Icon,Progress,Table,Thead,Tbody,Tr,Th,Td,Spinner} from '@chakra-ui/react';
import {FiMessageCircle,FiAlertTriangle,FiClock,FiSmile,FiActivity,FiArrowUpRight,FiChevronRight} from 'react-icons/fi';
import {useAppData} from '../context/AppDataContext';
import {useNavigate} from 'react-router-dom';
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from 'recharts';

const Card=({children,...p})=><Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="10px" {...p}>{children}</Box>;
const Metric=({label,value,change,icon,color,down})=><Card p={4} borderTop="3px solid" borderTopColor={color}><Flex justify="space-between"><Box><Text fontSize="10px" color="gray.500" fontWeight="800" textTransform="uppercase" letterSpacing=".35px">{label}</Text><Heading mt={2} size="lg">{value}</Heading><HStack mt={1}><Icon as={FiArrowUpRight} transform={down?'rotate(90deg)':'none'} color={color}/><Text fontSize="10px" color={color}>{change}</Text><Text fontSize="10px" color="gray.400">vs last period</Text></HStack></Box><Box p={2.5} bg="gray.50" borderRadius="8px" color={color}><Icon as={icon} boxSize={5}/></Box></Flex></Card>;

const chartData=[38,48,44,61,55,74,68,91,80,98,87,104].map((v,i)=>({time:i,volume:v,sla:Math.round(v*.57+12)}));

const Dashboard=()=>{
 const {conversations,loading}=useAppData(); const [range,setRange]=useState('Today'); const [liveMetrics,setLiveMetrics]=useState(null);
 useEffect(()=>{const es=new EventSource('http://localhost:8080/api/dashboard/stream'); es.addEventListener('metrics',e=>{try{setLiveMetrics(JSON.parse(e.data));}catch(_){} }); return ()=>es.close();},[]); const nav=useNavigate();
 const active=liveMetrics?.active ?? conversations.filter(c=>c.status==='active').length;
 const escalated=liveMetrics?.escalations ?? conversations.filter(c=>c.status==='escalated').length;
 const resolved=conversations.filter(c=>c.status==='resolved').length;
 const csat=liveMetrics?.csat ?? (conversations.length?Math.round(conversations.reduce((s,c)=>s+(c.metrics?.sentiment||.82),0)/conversations.length*100):87);
 const queue=useMemo(()=>[...conversations].sort((a,b)=>({high:0,medium:1,low:2}[a.alertLevel]||3)-({high:0,medium:1,low:2}[b.alertLevel]||3)).slice(0,5),[conversations]);
 const rows=queue.length?queue:[{id:'demo-1',customer:{name:'Elena Vasquez'},tags:['Refund'],status:'escalated',alertLevel:'high'},{id:'demo-2',customer:{name:'Marcus Lee'},tags:['Account'],status:'active',alertLevel:'medium'},{id:'demo-3',customer:{name:'Noah Williams'},tags:['Delivery'],status:'waiting',alertLevel:'medium'},{id:'demo-4',customer:{name:'Ava Thompson'},tags:['Product'],status:'active',alertLevel:'low'},{id:'demo-5',customer:{name:'Oliver Chen'},tags:['Billing'],status:'active',alertLevel:'low'}];
 return <Box>
  <Flex justify="space-between" align={{base:'start',md:'center'}} mb={5} direction={{base:'column',md:'row'}} gap={3}>
   <Box><Text fontSize="10px" color="gray.500" fontWeight="800" letterSpacing=".5px">SUPERVISOR CONTROL ROOM</Text><Heading size="lg" mt={1}>Dashboard</Heading><Text color="gray.500" fontSize="13px">Monitor conversations, agent health, and escalation risk.</Text></Box>
   <HStack><Button size="sm" variant={range==='Today'?'solid':'outline'} onClick={()=>setRange('Today')}>Today</Button><Button size="sm" variant={range==='This Week'?'solid':'outline'} onClick={()=>setRange('This Week')}>This Week</Button><Button size="sm" variant={range==='This Month'?'solid':'outline'} onClick={()=>setRange('This Month')}>This Month</Button></HStack>
  </Flex>
  <SimpleGrid columns={{base:1,sm:2,lg:5}} spacing={3} mb={4}>
   <Metric label="Active conversations" value={active||1} change="+14.2%" icon={FiMessageCircle} color="blue.500"/>
   <Metric label="Escalations" value={escalated} change="-8.1%" icon={FiAlertTriangle} color="orange.500" down/>
   <Metric label="Resolution rate" value={(liveMetrics?.resolutionRate ?? (conversations.length?Math.round(resolved/conversations.length*100):73.4))+'%'} change="+4.6%" icon={FiActivity} color="green.500"/>
   <Metric label="Avg response time" value={liveMetrics ? `${String(Math.floor(liveMetrics.avgResponseTime/60)).padStart(2,"0")}:${String(liveMetrics.avgResponseTime%60).padStart(2,"0")}` : "06:18"} change="-12.4%" icon={FiClock} color="purple.500" down/>
   <Metric label="CSAT" value={csat+'%'} change="+3.2%" icon={FiSmile} color="teal.500"/>
  </SimpleGrid>
  <Grid templateColumns={{base:'1fr',xl:'1.7fr 1fr 1fr'}} gap={3} mb={3}>
   <Card p={4} h="250px"><Flex justify="space-between" mb={1}><Box><Heading size="sm">Conversation volume & SLA exposure</Heading><Text fontSize="10px" color="gray.500">Live workload against response-time targets</Text></Box><Badge colorScheme="green">Live</Badge></Flex><Box h="190px" mt={2}><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{top:8,right:8,left:-28,bottom:0}}><CartesianGrid stroke="#edf0f4" vertical={false}/><XAxis dataKey="time" hide/><YAxis hide domain={[0,110]}/><Tooltip contentStyle={{fontSize:11,borderRadius:8}}/><Line type="monotone" dataKey="volume" stroke="#5b3f91" strokeWidth={2.5} dot={false}/><Line type="monotone" dataKey="sla" stroke="#e4a12b" strokeWidth={1.5} strokeDasharray="5 4" dot={false}/></LineChart></ResponsiveContainer></Box><HStack mt={-1} spacing={2}><Badge colorScheme="purple" fontSize="8px">● Live</Badge><Badge colorScheme="yellow" fontSize="8px">● SLA exposure</Badge></HStack></Card>
   <Card p={4} h="250px"><Heading size="sm">Queue health</Heading><Text fontSize="10px" color="gray.500" mb={4}>Current operational load</Text>{[['Response SLA',82,'green'],['Product support',68,'orange'],['Account access',91,'green'],['Escalation queue',44,'red']].map(([n,v,c])=><Box mb={4} key={n}><Flex justify="space-between" fontSize="10px" mb={1}><Text>{n}</Text><Text fontWeight="700">{v}%</Text></Flex><Progress value={v} size="xs" colorScheme={c}/></Box>)}</Card>
   <Card p={4} h="250px"><Heading size="sm">Critical signals</Heading><Text fontSize="10px" color="gray.500" mb={3}>Requires supervisor attention</Text>{[['SLA breach cluster','Returns queue · 9 conversations','high'],['Sentiment anomaly','North America · -18% in 10 min','medium'],['Agent degradation','CSR Agent v4.2 · fallback rate 24%','medium']].map(([a,b,l],i)=><Box key={a} p={2.5} mb={2} bg={i===0?'red.50':'orange.50'} borderRadius="7px"><Flex justify="space-between"><Text fontWeight="700" fontSize="10px">{a}</Text><Badge colorScheme={i===0?'red':'orange'} fontSize="8px">{l}</Badge></Flex><Text fontSize="9px" color="gray.600">{b}</Text></Box>)}</Card>
  </Grid>
  <Grid templateColumns={{base:'1fr',xl:'1.7fr 1fr'}} gap={3}>
   <Card p={4}><Flex justify="space-between" align="center" mb={3}><Box><Heading size="sm">Priority conversation queue</Heading><Text fontSize="10px" color="gray.500">AI-ranked by urgency, value, and breach risk</Text></Box><HStack><Badge>All queues</Badge><Badge>Sort: risk</Badge><Button size="xs" variant="ghost" onClick={()=>nav('/conversations')}><FiChevronRight/></Button></HStack></Flex>
    <Table size="sm"><Thead><Tr><Th fontSize="8px">CUSTOMER / CASE</Th><Th fontSize="8px">QUEUE</Th><Th fontSize="8px">AI OWNER</Th><Th fontSize="8px">RISK</Th><Th fontSize="8px">WAIT</Th><Th fontSize="8px">RECOMMENDED ACTION</Th></Tr></Thead><Tbody>{rows.map((c,i)=><Tr key={c.id||i} cursor="pointer" _hover={{bg:'gray.50'}} onClick={()=>!String(c.id).startsWith('demo-')&&nav('/conversation/'+(c.id||c._id))}><Td fontWeight="700" fontSize="10px">{c.customer?.name||'Customer'} <Text as="span" color="gray.400">· #{String(c.id||c._id||'84291').slice(-5)}</Text></Td><Td fontSize="9px">{c.tags?.[0]||'Support'}</Td><Td fontSize="9px">{c.agent?.name||'CSR Agent'}</Td><Td><Badge colorScheme={c.alertLevel==='high'?'red':c.alertLevel==='medium'?'orange':'green'}>{c.alertLevel==='high'?96:c.alertLevel==='medium'?72:48}</Badge></Td><Td fontSize="9px">{c.metrics?.responseTime||'06:18'}</Td><Td fontSize="9px" color="brand.600" fontWeight="700">{c.alertLevel==='high'?'Take over':c.alertLevel==='medium'?'Review evidence':'Monitor'}</Td></Tr>)}</Tbody></Table>
   </Card>
   <Card p={4}><Flex justify="space-between" mb={3}><Box><Heading size="sm">Live supervisor feed</Heading><Text fontSize="10px" color="gray.500">Decisions, handoffs, and model events</Text></Box><Badge colorScheme="green">Auto-refresh</Badge></Flex>{rows.slice(0,5).map((c,i)=><Flex key={c.id||i} gap={3} py={2.5} borderBottom={i<4?'1px solid':'0'} borderColor="gray.100"><Box w="7px" h="7px" mt={1.5} borderRadius="full" bg={i===0?'red.400':'brand.400'}/><Box><Text fontSize="10px" fontWeight="700">{i===0?'Takeover approved':i===1?'Knowledge fallback':i===2?'SLA alert raised':i===3?'Template inserted':'Agent version routed'}</Text><Text fontSize="9px" color="gray.500">{c.customer?.name||'Customer'} · Supervisor event</Text></Box></Flex>)}</Card>
  </Grid>
 </Box>
};
export default Dashboard;