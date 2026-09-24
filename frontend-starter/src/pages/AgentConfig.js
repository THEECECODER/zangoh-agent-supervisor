import React,{useEffect,useState} from 'react';
import {Box,Flex,Grid,Heading,Text,Button,HStack,Select,Slider,SliderTrack,SliderFilledTrack,SliderThumb,Switch,Badge,Progress,Divider,Table,Thead,Tbody,Tr,Th,Td,useToast,Tabs,TabList,Tab,TabPanels,TabPanel,Textarea} from '@chakra-ui/react';
import {FiSave,FiRotateCcw,FiPlay,FiAlertTriangle,FiCheckCircle} from 'react-icons/fi';
import {useAppData} from '../context/AppDataContext';
import {updateAgentConfig} from '../api';

const AgentConfig=()=>{
 const {agents}=useAppData();
 const [idx,setIdx]=useState(0),[temp,setTemp]=useState(.68),[topP,setTopP]=useState(.8),[tokens,setTokens]=useState(150),[threshold,setThreshold]=useState(.64),[saving,setSaving]=useState(false),[draft,setDraft]=useState(false),toast=useToast();
 const agent=agents[idx];
 useEffect(()=>{if(agent){setTemp(agent.parameters?.temperature??.68);setTopP(agent.parameters?.top_p??.8);setTokens(agent.parameters?.max_tokens??150);setThreshold(agent.escalationThresholds?.lowConfidence??.64)}},[agent]);
 const save=async()=>{if(!agent)return;setSaving(true);try{await updateAgentConfig(agent.id,{parameters:{temperature:temp,top_p:topP,max_tokens:tokens},escalationThresholds:{lowConfidence:threshold}});setDraft(false);toast({title:'Agent configuration saved',status:'success'});}catch(e){toast({title:'Could not save configuration',status:'error'});}finally{setSaving(false)}};
 const reset=()=>{if(!agent)return;setTemp(agent.parameters?.temperature??.68);setTopP(agent.parameters?.top_p??.8);setTokens(agent.parameters?.max_tokens??150);setThreshold(agent.escalationThresholds?.lowConfidence??.64);setDraft(false)};
 const change=setter=>v=>{setter(v);setDraft(true)};
 const capabilities=agent?.capabilities||[];
 return <Box>
  <Flex justify="space-between" align={{base:'start',md:'center'}} mb={5} gap={3} flexWrap="wrap">
   <Box><Text fontSize="10px" color="gray.500" fontWeight="800">SUPERVISOR CONTROL ROOM</Text><Heading size={{base:'md',md:'lg'}}>CSR-Returns · Control Room</Heading><Text color="gray.500" fontSize="11px">Configure, evaluate, and deploy agent behavior with governed change controls.</Text></Box>
   <HStack><Badge colorScheme={draft?'yellow':'green'}>{draft?'Draft changes':'Saved'}</Badge><Button size="sm" variant="outline" leftIcon={<FiRotateCcw/>} onClick={reset}>Reset</Button><Button size="sm" leftIcon={<FiSave/>} isLoading={saving} onClick={save}>Review & deploy</Button></HStack>
  </Flex>
  <Grid templateColumns={{base:'1fr',lg:'230px 1fr',xl:'230px minmax(0,1.45fr) 300px'}} gap={3} alignItems="start">
   <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="10px" p={4}>
    <Flex justify="space-between" mb={4}><Heading size="xs">Behavior configuration</Heading><Select w="110px" size="xs" value={idx} onChange={e=>setIdx(Number(e.target.value))}>{agents.map((a,i)=><option key={a.id} value={i}>{a.name}</option>)}</Select></Flex>
    <Tabs size="sm" variant="soft-rounded" colorScheme="purple"><TabList mb={4}><Tab fontSize="9px">Parameters</Tab><Tab fontSize="9px">Capabilities</Tab><Tab fontSize="9px">Knowledge</Tab></TabList><TabPanels>
     <TabPanel p={0}>
      {[['Creativity / Top-p',topP,change(setTopP),0,1,'Exploratory'],['Response speed',Math.min(1,tokens/500),v=>{setTokens(Math.round(v*500/10)*10);setDraft(true)},0,1,'Fast'],['Empathy',.86,()=>{},0,1,'High'],['Stability',1-threshold,()=>{},0,1,'Stable']].map(([n,v,on,min,max,d])=><Box mb={5} key={n}><Flex justify="space-between"><Text fontSize="10px" fontWeight="700">{n}</Text><Badge fontSize="9px">{n.includes('Top-p')?v.toFixed(2):d}</Badge></Flex><Slider mt={2} value={v} onChange={on} min={min} max={max} step={.01}><SliderTrack><SliderFilledTrack/></SliderTrack><SliderThumb/></Slider><Text fontSize="8px" color="gray.400">{d}</Text></Box>)}
      <Divider/><Text mt={4} mb={3} fontSize="10px" fontWeight="800">Escalation policy</Text>
      {[['No agent response','90 sec'],['Customer sentiment','≤ -0.55'],['Refund value','≥ ₹5,000'],['Confidence score',Math.round(threshold*100)+'%']].map(([a,b])=><Flex key={a} justify="space-between" py={2} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="9px">{a}</Text><Badge fontSize="8px">{b}</Badge></Flex>)}
     </TabPanel>
     <TabPanel p={0}>{capabilities.map(c=><Flex key={c.id} justify="space-between" py={3} borderBottom="1px solid" borderColor="gray.100"><Text fontSize="10px">{c.name}</Text><Switch size="sm" isChecked={c.enabled} onChange={()=>toast({title:'Capability change staged',status:'info'})}/></Flex>)}</TabPanel>
     <TabPanel p={0}><Text fontSize="10px" color="gray.500">Connected knowledge bases</Text><Text mt={3} fontSize="11px">Returns policy · Product catalogue · Shipping rules</Text></TabPanel>
    </TabPanels></Tabs>
    <Box mt={4} p={3} bg="gray.50" borderRadius="8px"><Text fontSize="8px" color="gray.500">CHANGE REQUEST</Text><Text fontSize="10px" fontWeight="700">CR-1842 · 6 fields modified</Text><Badge mt={2} colorScheme="yellow">Risk: Moderate</Badge></Box>
   </Box>
   <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="10px" p={4}>
    <Flex justify="space-between" mb={4}><Box><Heading size="sm">Performance & guardrails</Heading><Text fontSize="9px" color="gray.500">124 scenarios across policy, tone, safety, and task completion</Text></Box><Badge>Last 7 days</Badge></Flex>
    <Grid templateColumns="1fr 1fr" gap={3} mb={5}>{[['CONTAINMENT','74.6%','+3.2%'],['CSAT','8.8','+0.4'],['FALLBACK','11.2%','-2.1%'],['HALLUCINATION','0.7%','-0.3%']].map(([a,b,c])=><Box key={a} p={3} bg="gray.50" borderRadius="8px"><Text fontSize="8px" color="gray.500">{a}</Text><Flex justify="space-between" align="end"><Text fontWeight="800" fontSize="17px">{b}</Text><Text fontSize="8px" color="green.500">{c}</Text></Flex></Box>)}</Grid>
    <Text fontSize="11px" fontWeight="800" mb={3}>Evaluation suite</Text>
    {[['Policy adherence',96,'green'],['Refund reasoning',91,'green'],['Empathy & tone',86,'orange'],['Prompt injection',100,'green'],['Knowledge freshness',78,'red']].map(([a,v,c])=><Box mb={3} key={a}><Flex justify="space-between" fontSize="9px"><Text>{a}</Text><HStack><Text>{v}%</Text><Badge colorScheme={c}>{v>=90?'Pass':v>=80?'Review':'Risk'}</Badge></HStack></Flex><Progress mt={1} value={v} colorScheme={c} size="xs"/></Box>)}
    <Divider my={5}/><Text fontSize="11px" fontWeight="800" mb={2}>Routing matrix</Text><Text fontSize="8px" color="gray.500" mb={2}>Traffic split by intent and customer tier</Text>
    <Table size="sm" fontSize="8px"><Thead><Tr><Th fontSize="7px">INTENT</Th><Th fontSize="7px">MODEL</Th><Th fontSize="7px">TIER</Th><Th fontSize="7px">TRAFFIC</Th><Th fontSize="7px">FAILOVER</Th></Tr></Thead><Tbody>{[['Returns','v4.3','VIP','100%','Human'],['Returns','v4.3','Standard','80%','v4.2'],['Damaged item','v4.2','All','100%','Human'],['Policy exception','Human','All','100%','—']].map(r=><Tr key={r.join('-')}>{r.map(x=><Td key={x} py={2}>{x}</Td>)}</Tr>)}</Tbody></Table>
   </Box>
   <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="10px" p={4}>
    <Flex justify="space-between"><Heading size="sm">Simulation console</Heading><Badge colorScheme="blue">Scenario 18/24</Badge></Flex>
    <Box mt={3} p={3} bg="gray.50" borderRadius="8px"><Text fontSize="8px" color="gray.500">CUSTOMER PROMPT</Text><Text fontSize="10px" mt={1}>“My refund is delayed and I need the money today. Can you override policy?”</Text></Box>
    <Box mt={3} p={3} bg="purple.50" borderRadius="8px"><Text fontSize="8px" color="gray.500">AGENT RESPONSE · v4.3</Text><Text fontSize="10px" mt={1}>“I’m sorry this delay is creating stress. I found your return evidence. Because the amount exceeds my approval threshold, I’ve prepared an expedited review for a supervisor.”</Text><HStack mt={3}><Badge colorScheme="purple">Policy cited</Badge><Badge colorScheme="purple">Escalated</Badge></HStack></Box>
    <Button mt={3} size="sm" w="100%" leftIcon={<FiPlay/>} onClick={()=>toast({title:'Simulation completed',description:'Policy and escalation checks passed.',status:'success'})}>Run next test case</Button>
    <Divider my={5}/><Heading size="xs" mb={3}>Decision trace</Heading>{['Intent: returns · refund_delay','Sentiment: urgent_negative · 0.82','Policy rule: RET-2.4 escalation','Risk gate: value > autonomous limit'].map(x=><Text key={x} fontSize="9px" py={2} borderBottom="1px solid" borderColor="gray.100">{x}</Text>)}
    <Box mt={4} p={3} bg="green.50" borderRadius="8px"><Flex align="center" gap={2}><FiCheckCircle/><Text fontSize="11px" fontWeight="800" color="green.700">PASS · 92/100</Text></Flex><Text fontSize="9px" color="gray.600">Strong alignment with evaluation rubric.</Text></Box>
   </Box>
  </Grid>
 </Box>
};
export default AgentConfig;