const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Model = require('./models/User')

require('dotenv').config();
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jhjov.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const option = {useNewUrlParser:true, useUnifiedTopology:true};
mongoose.connect(uri, option)
.then(() => console.log('You are connected'))
.catch(e => console.log(e))

app.use(bodyParser.urlencoded({extended: true}))
app.set('json spaces', 4)
app.use(bodyParser.json());

const router = require('./routes/users')

app.use('/', router)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + "/public"))

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log('Server run in port:'+ PORT)
})

const SocketIO = require('socket.io');
const io = SocketIO(server); 

io.on('connection', (socket) =>{
  console.log('search')
  socket.on('search:value', async (data) =>{
    const results = await Model.find({name: new RegExp("^" + data.value ,'i')});
    socket.emit('search:result', {results})
  })

  socket.on('contact:add', async (data) =>{
    const { _id, contactID } = data;  
    const results = await Model.updateOne({_id}, {$push:{contacts: contactID}});
    socket.emit('contact:added', {addedID: contactID, results})
  })

  socket.on('contact:get', async (data) =>{
    const { _id } = data;
    const results = await Model.findOne({_id},{password: 0, _id: 0, email: 0});
    socket.emit('contact:post', {results})
  })

  socket.on('contact:remove', async (data) =>{
    const { _id, contactID } = data; 
    await Model.updateOne({_id}, {$pull: {contacts:null}});
    const results = await Model.updateOne({_id}, {$pull: {contacts:contactID}});
    socket.emit('contact:removed', {removedID:contactID, results})
  })  

  socket.on('get:contacts', async(data) => {
    const { _id } = data;
  
    const user = await Model.findOne({_id}, {passsword: 0, email:0});
    const results = await Model.find({_id: {$in: user.contacts}}, {password: 0, contacts: 0, chats:0 });
    socket.emit('post:contacts', {results});
  })
})


