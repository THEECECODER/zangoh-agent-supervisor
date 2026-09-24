import React,{useEffect,useMemo,useState} from 'react';
import {Box,Flex,Grid,Heading,Text,Input,Button,Textarea,Select,Badge,HStack,VStack,Divider,Checkbox,useToast,IconButton} from '@chakra-ui/react';
import {FiPlus,FiStar,FiEdit3,FiTrash2,FiArrowRight,FiSearch,FiX} from 'react-icons/fi';
import {getTemplates,createTemplate,updateTemplate} from '../api';

const fallback=[
 {id:'local-1',name:'Welcome new visitor',category:'Onboarding',channel:'Website',content:'Welcome, {{customer_name}} 👋\nThanks for visiting Acme. I can help you get started or point you to the right guide.',vars:['customer_name'],favorite:true,isShared:true,uses:128},
 {id:'local-2',name:'Product tour invite',category:'Onboarding',channel:'Messenger',content:'Hi {{customer_name}}, I can walk you through the key product features and answer any questions.',vars:['customer_name'],favorite:false,isShared:true,uses:84},
 {id:'local-3',name:'Getting started checklist',category:'Onboarding',channel:'Email',content:'Hi {{customer_name}}, here is a quick checklist to help you get started.',vars:['customer_name'],favorite:false,isShared:true,uses:61},
 {id:'local-4',name:'Trial follow-up',category:'Onboarding',channel:'Mobile',content:'Hi {{customer_name}}, checking in after your trial. Is there anything I can help with?',vars:['customer_name'],favorite:false,isShared:true,uses:61},
 {id:'local-5',name:'Refund update',category:'Returns',channel:'Email',content:'Hi {{customer_name}}, your refund {{order_id}} is currently being processed.',vars:['customer_name','order_id'],favorite:true,isShared:true,uses:42},
 {id:'local-6',name:'Shipping delay',category:'Shipping',channel:'Chat',content:'Hi {{customer_name}}, your shipment {{order_id}} is delayed until {{delivery_date}}.',vars:['customer_name','order_id','delivery_date'],favorite:false,isShared:false,uses:24}
];
const varsFrom=t=>[...new Set([...(t||'').matchAll(/\{\{\s*([a-zA-Z_][\w]*)\s*\}\}/g)].map(m=>m[1]))];

const Templates=()=>{
 const toast=useToast();
 const [templates,setTemplates]=useState([]);
 const [search,setSearch]=useState('');
 const [category,setCategory]=useState('All templates');
 const [channel,setChannel]=useState('All channels');
 const [selected,setSelected]=useState(null);
 const [editing,setEditing]=useState(null);
 const [previewValues,setPreviewValues]=useState({});
 const [sort,setSort]=useState('Most used');

 useEffect(()=>{getTemplates().then(data=>setTemplates(data?.length?data.map(t=>({...t,vars:varsFrom(t.content)})):fallback)).catch(()=>setTemplates(fallback));},[]);

 const categories=['All templates','Popular','Low use','Onboarding','Billing','Engagement','Transaction'];
 const channels=['All channels','Email','Website','Mobile','Messenger','Chat'];
 const filtered=useMemo(()=>{
   let list=templates.filter(t=>{
     const q=search.toLowerCase();
     const matchesSearch=!q||(t.name||'').toLowerCase().includes(q)||(t.content||'').toLowerCase().includes(q)||(t.category||'').toLowerCase().includes(q);
     const matchesCategory=category==='All templates'||category==='Popular'||category==='Low use'||t.category===category;
     const matchesChannel=channel==='All channels'||t.channel===channel;
     return matchesSearch&&matchesCategory&&matchesChannel;
   });
   return [...list].sort((a,b)=>sort==='Most used'?((b.uses||0)-(a.uses||0)):String(a.name).localeCompare(String(b.name)));
 },[templates,search,category,channel,sort]);

 useEffect(()=>{if(filtered.length&&!selected)setSelected(filtered[0]);},[filtered,selected]);

 const resolved=(selected?.content||'').replace(/\{\{\s*([a-zA-Z_][\w]*)\s*\}\}/g,(_,v)=>previewValues[v]||'['+v+']');
 const vars=varsFrom(selected?.content||'');

 const save=async()=>{
   if(!editing?.name?.trim()||!editing?.content?.trim()){toast({title:'Name and content are required',status:'warning'});return;}
   const payload={...editing,variables:undefined};
   try{
     const saved=editing.id&&!String(editing.id).startsWith('local-')?await updateTemplate(editing.id,payload):await createTemplate(payload);
     const normalized={...saved,vars:varsFrom(saved.content)};
     setTemplates(prev=>editing.id?prev.map(t=>t.id===editing.id?normalized:t):[...prev,normalized]);
     setSelected(normalized);setEditing(null);
     toast({title:'Template saved',status:'success'});
   }catch(e){
     const local={...editing,id:editing.id||'local-'+Date.now(),vars:varsFrom(editing.content),uses:editing.uses||0};
     setTemplates(prev=>editing.id?prev.map(t=>t.id===editing.id?local:t):[...prev,local]);
     setSelected(local);setEditing(null);
     toast({title:'Template saved locally',status:'warning'});
   }
 };
 const openNew=()=>setEditing({name:'',category:'Onboarding',channel:'Website',content:'Welcome, {{customer_name}}! How can I help you today?',isShared:false});

 const cardBg=['#f7f5ff','#f1f8fc','#fffaf0','#f1faf6'];
 return <Box>
   <Flex justify="space-between" align="start" mb={5} gap={4}>
     <Box><Heading size="lg" letterSpacing="-0.4px">Template Governance Workspace</Heading><Text fontSize="11px" color="gray.500" mt={1}>Manage content quality, approvals, localization, performance, and lifecycle.</Text></Box>
     <Button size="sm" leftIcon={<FiPlus/>} onClick={openNew}>Create template</Button>
   </Flex>

   <Grid templateColumns={{base:'1fr',xl:'145px minmax(0,1fr) 250px'}} gap={0} bg="white" border="1px solid" borderColor="gray.200" borderRadius="12px" overflow="hidden" minH={{xl:'610px'}}>
     <Box borderRight="1px solid" borderColor="gray.200" p={3}>
       <Text fontSize="8px" fontWeight="900" color="gray.500" mb={2}>TEMPLATE LIBRARY</Text>
       <Input size="xs" mb={3} placeholder="Search categories" leftIcon={<FiSearch/>}/>
       <VStack align="stretch" spacing={1}>
        {categories.map((x,i)=><Box key={x} px={2} py={1.5} borderRadius="6px" bg={category===x?'purple.50':'transparent'} color={category===x?'purple.700':'gray.600'} cursor="pointer" onClick={()=>setCategory(x)}><Flex align="center" gap={2}><Box w="5px" h="5px" borderRadius="full" bg={i===0?'purple.400':i<3?'gray.400':i===3?'purple.300':i===4?'blue.400':i===5?'green.400':'orange.400'}/><Text fontSize="9px">{x}</Text>{i===0&&<Badge ml="auto" fontSize="7px" colorScheme="purple">{templates.length||24}</Badge>}</Flex></Box>)}
       </VStack>
       <Divider my={4}/>
       <Text fontSize="8px" fontWeight="900" color="gray.500" mb={2}>BY CHANNEL</Text>
       <VStack align="stretch" spacing={1}>{channels.slice(1).map((x,i)=><Box key={x} px={2} py={1.5} cursor="pointer" onClick={()=>setChannel(channel===x?'All channels':x)}><Flex align="center" gap={2}><Box w="5px" h="5px" borderRadius="full" bg={['orange.400','blue.400','cyan.400','purple.400'][i]}/><Text fontSize="9px" color={channel===x?'purple.700':'gray.600'}>{x}</Text></Flex></Box>)}</VStack>
     </Box>

     <Box p={4} minW={0}>
       <Flex justify="space-between" align="center" mb={3} gap={2} wrap="wrap">
         <Box><Heading size="sm">Response Templates</Heading><Text fontSize="9px" color="gray.500">Choose a reply and customize it before inserting.</Text></Box>
       </Flex>
       <Flex gap={2} mb={3} wrap="wrap">
         <Input flex="1" minW="180px" size="sm" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, message, or tag"/>
         <Select w="125px" size="sm" value={channel} onChange={e=>setChannel(e.target.value)}>{channels.map(x=><option key={x}>{x}</option>)}</Select>
         <Select w="105px" size="sm" value={sort} onChange={e=>setSort(e.target.value)}><option>Most used</option><option>Name</option></Select>
       </Flex>
       <HStack spacing={2} mb={4}><Button size="xs" colorScheme="purple" borderRadius="full">All templates</Button><Button size="xs" variant="outline" borderRadius="full">My team</Button><Button size="xs" variant="outline" borderRadius="full">Recently used</Button><Text ml="auto" fontSize="8px" color="gray.400">{filtered.length} results</Text></HStack>
       <Grid templateColumns={{base:'1fr',md:'1fr 1fr'}} gap={3}>
         {filtered.map((t,i)=><Box key={t.id} position="relative" p={2.5} border="1px solid" borderColor={selected?.id===t.id?'purple.300':'gray.200'} borderRadius="9px" cursor="pointer" onClick={()=>{setSelected(t);setPreviewValues({});}}>
           <Box bg={cardBg[i%cardBg.length]} borderRadius="7px" p={2.5} minH="62px">
             <Flex justify="space-between"><Box><Box w="72px" h="6px" bg="white" borderRadius="full" mb={2}/><Box w="110px" h="6px" bg="white" borderRadius="full"/></Box><IconButton aria-label="favorite" size="xs" variant="ghost" icon={<FiStar/>} color={t.favorite?'purple.500':'gray.400'}/></Flex>
           </Box>
           <Text fontSize="10px" fontWeight="800" mt={2}>{t.name}</Text>
           <Text fontSize="8px" color="gray.500" noOfLines={1} mt={1}>Friendly greeting with clear next steps.</Text>
           <Flex justify="space-between" align="center" mt={2}><HStack spacing={1}>{[t.category,t.channel||'Chat'].map(x=><Badge key={x} fontSize="6px" borderRadius="full" colorScheme="purple">{x}</Badge>)}</HStack><Text fontSize="7px" color="gray.400">{t.uses||0} uses</Text></Flex>
           {selected?.id===t.id&&<HStack position="absolute" bottom="-18px" left="50%" transform="translateX(-50%)" bg="white" borderRadius="full" boxShadow="sm" p={1} zIndex={2}><IconButton aria-label="delete" size="xs" icon={<FiTrash2/>} colorScheme="red" variant="ghost"/><IconButton aria-label="edit" size="xs" icon={<FiEdit3/>} variant="ghost" onClick={e=>{e.stopPropagation();setEditing({...t})}}/><IconButton aria-label="use" size="xs" icon={<FiArrowRight/>} colorScheme="green" variant="ghost" onClick={e=>{e.stopPropagation();toast({title:'Template selected',status:'success'})}}/></HStack>}
         </Box>)}
       </Grid>
     </Box>

     <Box borderLeft="1px solid" borderColor="gray.200" p={4} bg="white">
       <Text fontSize="8px" fontWeight="900" color="gray.500">PREVIEW</Text>
       <Text fontSize="8px" color="gray.500" mt={1}>Review the selected reply before inserting.</Text>
       <Text fontSize="8px" fontWeight="800" mt={4} mb={1}>PREVIEW AS</Text>
       <Select size="sm" value={previewValues.customer_name||''} placeholder="New visitor" onChange={e=>setPreviewValues(v=>({...v,customer_name:e.target.value}))}><option value="Avery">Avery</option><option value="Taran">Taran</option><option value="Elena">Elena</option></Select>
       <Box mt={3} p={3} border="1px solid" borderColor="gray.100" borderRadius="8px">
         <Text fontSize="8px" color="gray.500">Live preview</Text>
         <Box mt={2} bg="purple.50" borderRadius="8px" p={3}><Text fontSize="10px" lineHeight="1.5">{selected?resolved:'Select a template to preview.'}</Text></Box>
         <Button size="xs" w="100%" mt={3} variant="solid" onClick={()=>toast({title:'Preview opened',status:'info'})}>View getting started</Button>
       </Box>
       {vars.length>0&&<Box mt={4}>{vars.map(v=><Input key={v} size="xs" mb={2} value={previewValues[v]||''} placeholder={v} onChange={e=>setPreviewValues(p=>({...p,[v]:e.target.value}))}/>)}</Box>}
       <Box mt={6} p={3} bg="green.50" borderRadius="8px"><Text fontSize="9px" fontWeight="800" color="green.700">✓ {vars.filter(v=>previewValues[v]).length} variables resolved</Text><Text fontSize="8px" color="gray.500">You can edit the message after inserting.</Text></Box>
       <Flex justify="end" gap={2} mt={4}><Button size="xs" variant="outline" onClick={()=>setSelected(null)}>Cancel</Button><Button size="xs" onClick={()=>toast({title:'Template ready to insert',status:'success'})}>Insert</Button></Flex>
     </Box>
   </Grid>

   {editing&&<Box position="fixed" inset={0} bg="blackAlpha.500" zIndex={50} display="flex" alignItems="center" justifyContent="center" p={4}>
    <Box bg="white" borderRadius="12px" w="min(720px,100%)" p={6} boxShadow="2xl">
     <Flex justify="space-between" mb={5}><Heading size="md">{editing.id?'Edit Template':'Create Template'}</Heading><Button size="sm" variant="ghost" onClick={()=>setEditing(null)}><FiX/></Button></Flex>
     <Grid templateColumns={{base:'1fr',md:'1fr 1fr'}} gap={4}>
      <Box><Text fontSize="11px" fontWeight="700">Name</Text><Input value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/><Text fontSize="11px" fontWeight="700" mt={3}>Category</Text><Select value={editing.category} onChange={e=>setEditing({...editing,category:e.target.value})}>{['Onboarding','Shipping','Returns','Billing','Engagement','Transaction'].map(x=><option key={x}>{x}</option>)}</Select><Text fontSize="11px" fontWeight="700" mt={3}>Channel</Text><Select value={editing.channel} onChange={e=>setEditing({...editing,channel:e.target.value})}>{['Chat','Email','Website','Mobile','Messenger'].map(x=><option key={x}>{x}</option>)}</Select><Checkbox mt={4} isChecked={!!editing.isShared} onChange={e=>setEditing({...editing,isShared:e.target.checked})}>Share with team</Checkbox></Box>
      <Box><Text fontSize="11px" fontWeight="700">Content</Text><Textarea h="180px" value={editing.content} onChange={e=>setEditing({...editing,content:e.target.value})} placeholder="Use variables like {{customer_name}} or {{order_id}}"/><Text fontSize="10px" color="gray.500" mt={2}>Detected: {varsFrom(editing.content).map(v=>'{{'+v+'}}').join(', ')||'none'}</Text></Box>
     </Grid>
     <Flex justify="end" gap={2} mt={5}><Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button><Button onClick={save}>Save template</Button></Flex>
    </Box>
   </Box>}
 </Box>;
};
export default Templates;