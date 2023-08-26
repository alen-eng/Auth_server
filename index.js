const authRouter=require("./auth/auth.js")
require('dotenv').config()
const express=require("express")
const http=require('http')

const cors = require('cors')
const app =express()
const server=http.createServer(app)
const io=require('socket.io')(server)
const db=require("./connect")
const PORT=process.env.PORT || 3200


db.connect((err)=>{
    if(err)
      console.log('Database not connected!!'+err);
    else
    console.log('Database connected successfully!!');
  });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

 app.use(express.json())
 app.use(cors({
  'origin': 'https://xero-codee-three.vercel.app/',
     'methods': 'GET,POST,DELETE',
}));

 app.set("io", io)
 app.use(authRouter)

server.listen(PORT,()=>{
    console.log(`connected to PORT : ${PORT}`)
})
