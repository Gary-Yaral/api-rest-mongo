const router = require('express').Router();
const User = require('../models/User');
const Joi = require('@hapi/joi');
const schemaProperties = {
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
}

const schemaAccessProperties = {
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
}

const schemaValidator = Joi.object(schemaProperties)
const schemaAccess = Joi.object(schemaAccessProperties)

router.get('/sign-in', (req, res) => {
  res.render('sing-in')
})

router.get('/0/chat', (req, res) => {
  res.render('contacts')
})

router.get('/log-in', (req, res) => {
  res.render('log-in')
})

router.post('/log-in', async (req, res) => {
  const { error } = schemaAccess.validate(req.body);

  if (error) {
    return res.json({error})
  }

  try{

    const {email, password} = req.body;
    const results = await User.findOne({email});
    if(results.password === password) return res.json(results)
    return res.json({results: 0})

  } catch(error) {
    
    return res.status(400).json({message: "Bad request", error})
  
  }
})

router.post('/sign-in', async (req, res) => {
  const { error } = schemaValidator.validate(req.body);

  if (error) {
    return res.json({error})
  }

  try{

    const { name, email, password } = req.body;
    const results = await new User({name, email, password}).save();
    return res.json({result: 1})

  } catch(error) {
    
    return res.status(400).json({message: "Bad request", error})
  
  }
})


router.post('/admin/users', async (req, res) => {
  let { searched } = req.body;

  try{
      const results = await User.find({$or:[{name: new RegExp(searched,'i')},{email: new RegExp(searched,'i')}]}, {password: 0});
  
      return res.json({"result": results})
  } catch(error) {
    return res.status(400).json({message: "Bad request", error})
  }

})

router.post('/admin/users/:id', async (req, res) => {
  let _id = req.params.id;
  let contactId = req.body.contactId || false;
  if(contactId) {
    try{
        const results = await User.updateOne({_id}, {$push:{contacts: contactId}});
        return res.json({"result": results})
    } catch(error) {
      return res.status(400).json({message: "Bad request", error})
    }
  }

  try{
    const results = await User.findOne({_id}, {password: 0});
    return res.json({"result": results})
  } catch(error) {
    return res.status(400).json({message: "Bad request", error})
  }

})

router.delete('/admin/users/:id', async (req, res) => {
  let _id = req.params.id;
  let contactId = req.body.contactId || false;
  if(contactId) {
    try{
        const results = await User.updateOne({_id}, {$pull:{contacts: contactId}});
        return res.json({"result": results})
    } catch(error) {
      return res.status(400).json({message: "Bad request", error})
    }
  }

  try{
    const results = await User.findOne({_id}, {password: 0});
    return res.json({"result": results})
  } catch(error) {
    return res.status(400).json({message: "Bad request", error})
  }

})

/* 
router.get('/users', async (req, res) => {
  
  try{
      const results = await User.find();
      return res.json({results})
  } catch(error) {
    return res.status(400).json({message: "Bad request", error})
  }

})

router.get('/users/:id', async (req, res) => {

  const _id = req.params.id;

  try{

    const results = await User.find({_id});
    return res.json({results})

  } catch(error) {

    return res.status(400).json({message: "Bad request", error})
 
  }

}) */


/* router.post('/users/register', async (req, res) => {

  const { error } = schemaValidator.validate(req.body);

  if (error) {
    return res.status(404).json({message: "Bad request", error})
  }
  
  try{

    const { name, email, password } = req.body;
    const results = new User({name, email, password}).save();
    return res.json({results})

  } catch(error) {
    
    return res.status(400).json({message: "Bad request", error})
  
  }

}) */




/* router.delete('/admin/:id', async (req, res) => {
  
  try{

    const _id = req.params.id;
    const user = await User.deleteOne({_id});
    return res.json({result: 1})

  } catch(error) {
    
    return res.status(400).json({message: "Bad request", error})
  
  }

})

router.put('/admin/:id', async (req, res) => {
  const name = req.body.name || false;
  const email = req.body.email || false;
  const password = req.body.password || false;

  if (name && email && password) {
    
    try{
    
      const _id = req.params.id;
      const user = await User.updateOne({_id}, {$set: {name, email, password}});
      return res.json(user)
  
    } catch(error) {
      
      return res.status(400).json({message: "Bad request", error})
    
    }
  }

  if (name) {
    
    try{
    
      const _id = req.params.id;
      const user = await User.updateOne({_id}, {$set: {name}});
      return res.json(user)
  
    } catch(error) {
      
      return res.status(400).json({message: "Bad request", error})
    
    }
  }

  if (email) {
    
    try{
    
      const _id = req.params.id;
      const user = await User.updateOne({_id}, {$set: {email}});
      return res.json(user)
  
    } catch(error) {
      
      return res.status(400).json({message: "Bad request", error})
    
    }
  }

  if (password) {
    
    try{
    
      const _id = req.params.id;
      const user = await User.updateOne({_id}, {$set: {password}});
      return res.json(user)
  
    } catch(error) {
      
      return res.status(400).json({message: "Bad request", error})
    
    }
  }

  return res.status(400).json({message: "Bad request", error})

}) */

module.exports = router;