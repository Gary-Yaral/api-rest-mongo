const router = require('express').Router();
const User = require('../models/User');
const Joi = require('@hapi/joi');
const schemaValidator = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

router.get('/users', async (req, res) => {
  const { error } = schemaValidator.validate(req.body);

  if (error) {
    return res.status(404).json({message: "Bad request", error})
  }

  try{

      const results = await User.find();
      return res.json({results})
  }
  catch (error){
    return res.status(400).json({message: "Bad request", error})
  }

})

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try{
      const results = await User.find({_id});
      return res.json({results})
  }
  catch (error){
    return res.status(400).json({message: "Bad request", error})
  }

})

router.post('/users/register', async (req, res) => {
  const { error } = schemaValidator.validate(req.body);

  if (error) {
    return res.status(404).json({message: "Bad request", error})
  }
  
  try{
      const { name, email, password } = req.body;
      const results = new User({name, email, password}).save();
      return res.json({results})
  }
  catch (error){
    return res.status(400).json({message: "Bad request", error})
  }

})

module.exports = router;