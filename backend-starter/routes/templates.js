const express = require('express');
const router = express.Router();
const ResponseTemplate = require('../models/responseTemplate');
const { v4: uuidv4 } = require('uuid');

const extractVariables = (content='') => [...new Set([...content.matchAll(/\\{\\{\\s*([a-zA-Z_][\\w]*)\\s*\\}\\}/g)].map(m => m[1]))];

router.get('/', async (req,res,next)=>{ try {
  const filter = {};
  if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
  res.json(await ResponseTemplate.find(filter).sort({updatedAt:-1}));
} catch(e){ next(e); } });

router.post('/', async (req,res,next)=>{ try {
  const {name,category,content,createdBy='Supervisor',isShared=false,channel='Chat'} = req.body;
  if(!name || !category || !content) return res.status(400).json({message:'Name, category and content are required'});
  const template = await ResponseTemplate.create({id:uuidv4(),name,category,content,channel,variables:extractVariables(content).map(name=>({name,description:`Value for ${name}`})),createdBy,isShared:!!isShared});
  res.status(201).json(template);
} catch(e){ next(e); } });

router.patch('/:id', async (req,res,next)=>{ try {
  const template = await ResponseTemplate.findOne({id:req.params.id});
  if(!template) return res.status(404).json({message:'Template not found'});
  const {name,category,content,isShared,channel}=req.body;
  if(name!==undefined) template.name=name; if(category!==undefined) template.category=category; if(isShared!==undefined) template.isShared=!!isShared; if(channel!==undefined) template.channel=channel;
  if(content!==undefined){template.content=content; template.variables=extractVariables(content).map(name=>({name,description:`Value for ${name}`}));}
  await template.save(); res.json(template);
} catch(e){ next(e); } });

module.exports = router;