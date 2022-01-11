const mongoose = require('mongoose')
const userSquema = mongoose.Schema({
  name:{
    type: String,
    required: true,
    min:3,
    max:255
  },
  email:{
    type: String,
    required: true,
    min:6,
    max:255
  }
  ,
  password:{
    type: String,
    required: true,
    min:6,
    max:255
  },
  age:{
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User',userSquema);