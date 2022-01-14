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
  console.log('connected')
  socket.on('search:value', async (data) =>{
    const results = await Model.find({$or:[{name: new RegExp(data.value,'i')},{email: new RegExp(data.value,'i')}]}, {password: 0});
    io.sockets.emit('search:result', {results})
  })

  
})

