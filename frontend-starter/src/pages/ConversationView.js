import React,{useEffect,useState} from 'react';
import {Box,Flex,Text,Button,VStack,HStack,Avatar,Divider,Textarea,Badge,Heading,Progress,Input,Icon,Tooltip,useToast,Grid,Select,Modal,ModalOverlay,ModalContent,ModalBody} from '@chakra-ui/react';
import {FiHome,FiMessageSquare,FiBriefcase,FiZap,FiSettings,FiSearch,FiSend,FiShield,FiChevronDown,FiCheckCircle,FiEdit3,FiStar} from 'react-icons/fi';
import {useParams,useNavigate} from 'react-router-dom';
import {useAppData} from '../context/AppDataContext';
import {addMessage,interveneInConversation,releaseIntervention} from '../api';

const demo=[
 {id:'demo-1',customer:{name:'Elena Vasquez'},tags:['Refund blocked'],alertLevel:'high',status:'escalated',messages:[
  {sender:'customer',text:'I returned the item last week, but the refund is still blocked.'},
  {sender:'agent',text:'I found the return receipt and carrier confirmation. I’m checking the refund policy now.'},
  {sender:'customer',text:'I need the refund today. This is the second time I’m contacting support.'},
  {sender:'agent',text:'The amount exceeds my approval limit. I’ve prepared the evidence for supervisor review.'}
 ]},
 {id:'demo-2',customer:{name:'Marcus Lee'},tags:['Account locked'],alertLevel:'medium',status:'active',messages:[{sender:'customer',text:'My account is locked and I cannot sign in.'},{sender:'agent',text:'I can help you recover access. Let me verify a few details first.'}]},
 {id:'demo-3',customer:{name:'Noah Williams'},tags:['Delivery exception'],alertLevel:'medium',status:'waiting',messages:[{sender:'customer',text:'The delivery status has not changed for two days.'}]},
 {id:'demo-4',customer:{name:'Ava Thompson'},tags:['Product defect'],alertLevel:'low',status:'active',messages:[{sender:'customer',text:'The product arrived with a defect.'}]}
];

const templates=[
 {id:1,name:'Welcome new visitor',category:'Onboarding',channel:'Website',content:'Welcome, {{customer_name}} 👋 Thanks for visiting Acme. How can I help you today?',vars:['customer_name'],favorite:true},
 {id:2,name:'Product tour invite',category:'Onboarding',channel:'Messenger',content:'Hi {{customer_name}}, I’d love to show you around the product. Would you like a quick tour?',vars:['customer_name'],favorite:false},
 {id:3,name:'Getting started checklist',category:'Onboarding',channel:'Email',content:'Here is your getting started checklist, {{customer_name}}. Let me know if you need help.',vars:['customer_name'],favorite:false},
 {id:4,name:'Trial follow-up',category:'Engagement',channel:'Mobile',content:'Hi {{customer_name}}, checking in to see how your trial is going.',vars:['customer_name'],favorite:false}
];

const ConversationView=()=>{
 const {id}=useParams(); const nav=useNavigate(); const {conversations}=useAppData(); const toast=useToast();
 const [conv,setConv]=useState(null),[taken,setTaken]=useState(false),[text,setText]=useState(''),[notes,setNotes]=useState('');
 const [templateOpen,setTemplateOpen]=useState(false),[templateSearch,setTemplateSearch]=useState(''),[selectedTemplate,setSelectedTemplate]=useState(templates[0]),[previewName,setPreviewName]=useState('New visitor');
 const visibleTemplates=templates.filter(t=>t.name.toLowerCase().includes(templateSearch.toLowerCase())||t.category.toLowerCase().includes(templateSearch.toLowerCase()));
 const resolvedTemplate=(selectedTemplate?.content||'').replaceAll('{{customer_name}}',previewName==='New visitor'?'Avery':previewName);
 const insertTemplate=()=>{setText(resolvedTemplate);setTemplateOpen(false);toast({title:'Template inserted',description:'Variables resolved in preview.',status:'success',duration:1800});};
 const list=conversations.length?conversations:demo;
 useEffect(()=>setConv(list.find(c=>String(c.id||c._id)===String(id))||list[0]),[id,conversations]);
 useEffect(()=>{if(conv){setText('');setTaken(conv.humanIntervention?.occurred===true)}},[conv?.id]);
 if(!conv)return <Box p={8}>Loading conversation...</Box>;
 const messages=conv.messages?.length?conv.messages:demo[0].messages;
 const send=async()=>{if(!text.trim())return;try{const data=await addMessage(conv.id||conv._id,{sender:'supervisor',text:text.trim()});setConv({...conv,messages:data.messages||[...messages,{sender:'supervisor',text:text.trim()}]});setText('');toast({title:'Supervisor response sent',status:'success',duration:1800});}catch(e){toast({title:'Message failed',description:e.message,status:'error'});}};
 const take=async()=>{try{await interveneInConversation(conv.id||conv._id,'supervisor-01',notes);setTaken(true);toast({title:'Control taken over',status:'success'});}catch(e){setTaken(true);toast({title:'Supervisor mode enabled',status:'success'});}};
 const release=async()=>{try{await releaseIntervention(conv.id||conv._id,notes);setTaken(false);toast({title:'Control returned to AI',status:'success'});}catch(e){setTaken(false);toast({title:'AI control restored',status:'success'});}};
 const select=(c)=>nav('/conversation/'+(c.id||c._id));
 return <Flex h="calc(100vh - 0px)" minH="700px" bg="gray.50" overflow="hidden">
  <Box w="58px" bg="white" borderRight="1px solid" borderColor="gray.200" display={{base:'none',md:'flex'}} flexDir="column" alignItems="center" py={5} gap={4}>
   <Icon as={FiHome} boxSize={4} color="gray.600"/><Icon as={FiMessageSquare} boxSize={4} color="brand.600"/><Icon as={FiBriefcase} boxSize={4} color="gray.600"/><Icon as={FiZap} boxSize={4} color="gray.600"/><Box flex="1"/><Icon as={FiSettings} boxSize={4} color="gray.600"/>
  </Box>
  <Box w={{base:'230px',lg:'245px'}} bg="white" borderRight="1px solid" borderColor="gray.200" p={3} display={{base:'none',md:'block'}}>
   <Text fontSize="10px" fontWeight="800" color="gray.500" mb={2}>CUSTOMER CONVERSATIONS</Text>
   <HStack border="1px solid" borderColor="gray.200" borderRadius="6px" px={2} mb={3}><Icon as={FiSearch} color="gray.400"/><Input variant="unstyled" fontSize="10px" placeholder="Search customer or case..."/></HStack>
   <VStack spacing={2} align="stretch">{list.slice(0,6).map((c,i)=><Box key={c.id||c._id||i} p={2.5} border="1px solid" borderColor={String(c.id||c._id)===String(id)?'brand.300':'gray.200'} borderRadius="8px" cursor="pointer" bg={String(c.id||c._id)===String(id)?'brand.50':'white'} onClick={()=>select(c)}><Flex gap={2} align="center"><Avatar size="xs" name={c.customer?.name}/><Box flex="1" minW={0}><Text fontSize="10px" fontWeight="800" noOfLines={1}>{c.customer?.name||'Customer'}</Text><Text fontSize="8px" color="gray.500" noOfLines={1}>{c.tags?.[0]||'Support request'}</Text></Box><Text fontSize="8px" color="gray.400">{i?'09:18':'12:42'}</Text></Flex><Badge mt={2} fontSize="8px" colorScheme={c.alertLevel==='high'?'red':c.alertLevel==='medium'?'yellow':'purple'}>{c.alertLevel==='high'?'Critical':c.alertLevel==='medium'?'High':'Watch'}</Badge></Box>)}</VStack>
  </Box>
  <Box flex="1" minW={0} p={{base:3,md:4}} overflowY="auto">
   <Flex bg="white" border="1px solid" borderColor="gray.200" borderRadius="10px" minH="calc(100vh - 32px)" overflow="hidden" direction={{base:'column',xl:'row'}}>
    <Box flex="1.55" minW={0} borderRight={{xl:'1px solid'}} borderColor="gray.200">
     <Flex p={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.200"><HStack><Avatar size="sm" name={conv.customer?.name}/><Box><Text fontWeight="800" fontSize="12px">{conv.customer?.name} · Case #{String(conv.id||conv._id||'84291').slice(-5)}</Text><Text fontSize="8px" color="gray.500">Returns · Web chat · EN-US · VIP tier</Text></Box></HStack><HStack><Badge colorScheme="red" fontSize="8px">● {conv.alertLevel==='high'?'Critical':'High'}</Badge>{taken?<Button size="xs" colorScheme="orange" onClick={release}>Return AI</Button>:<Button size="xs" onClick={take}>Take over</Button>}</HStack></Flex>
     <Box px={4} py={2.5} bg="yellow.50" borderBottom="1px solid" borderColor="yellow.100"><Text fontSize="9px" fontWeight="800">⚠ SLA breach likely in 03:18</Text><Text fontSize="8px" color="gray.600">AI confidence fell after policy exception request</Text></Box>
     <VStack p={4} spacing={3} align="stretch">{messages.map((m,i)=><Flex key={i} justify={m.sender==='customer'?'start':'end'}><Box maxW="78%" bg={m.sender==='customer'?'gray.100':m.sender==='supervisor'?'brand.50':'purple.50'} px={3} py={2.5} borderRadius="9px"><Text fontSize="7px" color="gray.500" fontWeight="800" mb={1}>{m.sender==='customer'?'CUSTOMER':m.sender==='supervisor'?'SUPERVISOR':'AI AGENT'} · {i+1}{m.sender!=='customer'&&' · 11:32'}</Text><Text fontSize="10px" lineHeight="1.5">{m.text}</Text></Box></Flex>)}</VStack>
     <Box mx={4} mb={3} p={3} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="9px"><Flex justify="space-between" align="center"><Box><Text fontSize="9px" fontWeight="800">Co-pilot recommendation</Text><Text fontSize="8px" color="gray.500">Generated from policy, customer tier, and conversation sentiment</Text></Box><Badge colorScheme="green" fontSize="8px">● Confidence 88%</Badge></Flex><Text fontSize="8px" mt={2}>Approve expedited refund of ₹8,420 and waive the standard review period.</Text><Text fontSize="7px" color="gray.500" mt={1}>Evidence: return scan received · item category eligible · customer lifetime value: high</Text><HStack mt={2}><Button size="xs" onClick={()=>setText('I’ve reviewed the return evidence and approved an expedited refund.')}>Approve action</Button><Button size="xs" variant="outline" onClick={()=>setText('I’m reviewing the evidence and will update you shortly.')}>Edit response</Button><Button size="xs" variant="outline">Escalate policy</Button></HStack></Box>
     <Box mx={4} mb={4} p={3} border="1px solid" borderColor="gray.200" borderRadius="9px"><Flex justify="space-between" mb={2}><Text fontSize="9px" fontWeight="800">Supervisor response</Text><Button size="xs" variant="ghost" rightIcon={<FiChevronDown/>} onClick={()=>setTemplateOpen(true)}>Template</Button></Flex><Textarea value={text} onChange={e=>setText(e.target.value)} placeholder={taken?'Type a supervisor response...':'Take over to send a supervisor response.'} isDisabled={!taken} rows={2} fontSize="9px"/><Flex justify="end" mt={2}><Button size="xs" leftIcon={<FiSend/>} isDisabled={!taken||!text.trim()} onClick={send}>Send reply</Button></Flex></Box>
    </Box>
    <Box w={{base:'100%',xl:'275px'}} p={4} bg="white">
     <Heading size="xs">Customer intelligence</Heading><HStack mt={3}><Avatar size="sm" name={conv.customer?.name}/><Box><Text fontWeight="800" fontSize="10px">{conv.customer?.name} · Case #{String(conv.id||conv._id||'84291').slice(-5)}</Text><Text fontSize="8px" color="gray.500">VIP · 3.8 years · Madrid</Text></Box></HStack><Divider my={3}/><Flex justify="space-between"><Box><Text fontSize="7px" color="gray.500">LIFETIME VALUE</Text><Text fontWeight="800" fontSize="13px">₹1.24L</Text></Box><Box><Text fontSize="7px" color="gray.500">ORDERS</Text><Text fontWeight="800" fontSize="13px">38</Text></Box></Flex><Flex justify="space-between" mt={3}><Box><Text fontSize="7px" color="gray.500">RETURN RATE</Text><Text fontWeight="800" fontSize="11px">5.2%</Text></Box><Box><Text fontSize="7px" color="gray.500">SENTIMENT</Text><Text fontWeight="800" fontSize="11px" color="red.500">−0.62</Text></Box></Flex><Divider my={4}/><Text fontSize="10px" fontWeight="800">Case diagnostics</Text><Text fontSize="7px" color="gray.500">Signals contributing to risk</Text>{[['Repeat contact',92,'red'],['Negative sentiment',76,'orange'],['Policy exception',66,'blue'],['Churn propensity',58,'purple']].map(([n,v,c])=><Box mt={3} key={n}><Flex justify="space-between" fontSize="8px"><Text>{n}</Text><Text>{v}%</Text></Flex><Progress mt={1} value={v} size="xs" colorScheme={c}/></Box>)}<Divider my={4}/><Text fontSize="8px" color="gray.400" mb={1}>Feedback Notes</Text><Textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write here..." h="110px" fontSize="9px" bg="yellow.50" borderColor="yellow.100"/><Button mt={3} w="100%" size="sm" leftIcon={<FiCheckCircle/>} onClick={()=>toast({title:'Case marked resolved',status:'success'})}>Mark as Resolved</Button>
    </Box>
   </Flex>
  </Box>
 </Flex>
  <Modal isOpen={templateOpen} onClose={()=>setTemplateOpen(false)} size="5xl" isCentered>
   <ModalOverlay bg="blackAlpha.500"/>
   <ModalContent borderRadius="14px" overflow="hidden">
    <ModalBody p={0}>
     <Grid templateColumns="155px 1fr 245px" minH="500px">
      <Box bg="gray.50" p={4} borderRight="1px solid" borderColor="gray.200">
       <Text fontSize="9px" fontWeight="900" mb={3}>TEMPLATE LIBRARY</Text>
       <Input size="sm" bg="white" value={templateSearch} onChange={e=>setTemplateSearch(e.target.value)} placeholder="Search categories"/>
       {['All templates','Popular','Low use'].map((x,i)=><Box key={x} mt={3} p={2} borderRadius="6px" bg={i===0?'brand.50':'transparent'}><Text fontSize="9px" fontWeight={i===0?'800':'500'} color={i===0?'brand.700':'gray.600'}>● {x}</Text></Box>)}
       <Text fontSize="8px" fontWeight="900" color="gray.500" mt={5}>BY JOURNEY</Text>
       {['Onboarding','Billing','Engagement','Transaction'].map(x=><Text key={x} fontSize="9px" py={1.5}>● {x}</Text>)}
       <Text fontSize="8px" fontWeight="900" color="gray.500" mt={4}>BY CHANNEL</Text>
       {['Email','Website','Mobile','Messenger'].map(x=><Text key={x} fontSize="9px" py={1.5}>● {x}</Text>)}
      </Box>
      <Box p={4}>
       <Flex justify="space-between" align="center" mb={2}><Box><Heading size="sm">Response Templates</Heading><Text fontSize="9px" color="gray.500">Choose a reply and customize it before inserting.</Text></Box><Badge>{visibleTemplates.length} results</Badge></Flex>
       <Flex gap={2} mb={3}><Input size="sm" value={templateSearch} onChange={e=>setTemplateSearch(e.target.value)} placeholder="Search title, message, or tag"/><Select size="sm" w="105px"><option>All channels</option></Select><Select size="sm" w="100px"><option>Most used</option></Select></Flex>
       <HStack mb={3}><Badge colorScheme="purple">All templates</Badge><Badge>My team</Badge><Badge>Recently used</Badge></HStack>
       <Grid templateColumns="1fr 1fr" gap={3}>{visibleTemplates.map(t=><Box key={t.id} p={3} border="1px solid" borderColor={selectedTemplate.id===t.id?'brand.400':'gray.200'} borderRadius="9px" cursor="pointer" onClick={()=>setSelectedTemplate(t)} _hover={{borderColor:'brand.300'}}><Flex justify="space-between"><Box h="7px" w="70%" bg="gray.100" borderRadius="full"/>{t.favorite?<FiStar/>:<Text color="gray.300">☆</Text>}</Flex><Text fontSize="10px" fontWeight="800" mt={3}>{t.name}</Text><Text fontSize="8px" color="gray.500" noOfLines={2}>{t.content}</Text><HStack mt={2}><Badge fontSize="7px">{t.category}</Badge><Badge colorScheme="purple" fontSize="7px">{t.channel}</Badge></HStack></Box>)}</Grid>
      </Box>
      <Box p={4} borderLeft="1px solid" borderColor="gray.200">
       <Text fontSize="9px" fontWeight="900">Preview</Text><Text fontSize="8px" color="gray.500">Review the selected reply before inserting.</Text>
       <Text fontSize="8px" fontWeight="800" mt={4} mb={1}>PREVIEW AS</Text>
       <Select size="sm" value={previewName} onChange={e=>setPreviewName(e.target.value)}><option>New visitor</option><option>Elena Vasquez</option><option>Marcus Lee</option></Select>
       <Box mt={3} p={3} bg="gray.50" borderRadius="9px"><Badge mb={2} colorScheme="purple">Live preview</Badge><Text fontSize="9px" lineHeight="1.6">{resolvedTemplate}</Text><Button mt={3} size="xs" w="100%">View getting started</Button></Box>
       <Box mt={4} p={3} bg="green.50" borderRadius="8px"><Text fontSize="9px" fontWeight="800" color="green.700">✓ {selectedTemplate?.vars?.length||0} variables resolved</Text><Text fontSize="8px" color="gray.600">You can edit the message after inserting.</Text></Box>
       <Flex justify="end" gap={2} mt={5}><Button size="sm" variant="outline" onClick={()=>setTemplateOpen(false)}>Cancel</Button><Button size="sm" onClick={insertTemplate}>Insert</Button></Flex>
      </Box>
     </Grid>
    </ModalBody>
   </ModalContent>
  </Modal>
};
export default ConversationView;