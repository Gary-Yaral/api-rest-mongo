const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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

app.use('/api', router)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server run in port:'+ PORT)
})