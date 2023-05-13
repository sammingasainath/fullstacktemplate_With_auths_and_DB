const dotenv = require("dotenv")
const mongoose = require('mongoose');
const express = require('express');

const app = express();
dotenv.config({path:'./config.env'})
const port = process.env.PORT;


require('./db/conn');
// const User = require('./model/userSchema');

app.use(express.json());
app.use(require('./router/auth'))




// app.get('/',(req,res)=>{
//     res.send('Welcome to Home Page');

// });

// middleware

// middleware();

// app.get('/about',middleware,(req,res)=>{
//     res.send('Hello World , This is about Me From The Server');
    

// });

// app.get('/contact',(req,res)=>{
//     res.send('Hello World , This is Contact Me From The Server');

// });

// app.get('/signin',(req,res)=>{
//     res.send('Hello World , This is Sign In World From The Server');

// });

// app.get('/signup',(req,res)=>{
//     res.send('Hello World , This is Registration World From The Server');

// });

app.listen(port,()=>{
    console.log(`Server Is Running on port no. ${port}`)
})

// console.log('Hello World')





