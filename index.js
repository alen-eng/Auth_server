const authRouter=require("./auth/auth.js")
require('dotenv').config()
const express=require("express")
const mongoose=require("mongoose")
const http=require('http')
const User = require("./model/user.js")
const { USER_COLLECTION } = require("./model/user.js")

const app =express()
const server=http.createServer(app)
const io=require('socket.io')(server)

const mongoClient= require('mongodb').MongoClient

const PORT=process.env.PORT || 3000

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
// const DB=process.env.DB_PASS

// //middleware
 app.use(express.json())
 //app.use(io)
 app.set("io", io)
 app.use(authRouter)
// //


//(DB).then(()=>{
//     console.log("connection created")
// }).catch((e)=>{
//         console.log(e)
// })


const state ={
    db:null
}
module.exports.connect=function(done){
    //const Password=process.env.tvZwiltv8ylWVSkA
   const url= 'mongodb+srv://rangeappuser:2orL6IKcLoKpTkfD@cluster-007.kxziv.mongodb.net/Cluster-007';
    //const url='mongodb://localhost:27017'
    const dbname='trackapp'
    // mongoose.connect(url,(err,data)=>{
    //     if(err) return done(err)
    //     else console.log("connected");
    //     state.db=data.db(dbname)
    //     done()
    // })
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        else console.log('connected')
        state.db=data.db(dbname)
        done()
    })
}



module.exports.get=function(){
    return state.db
}







// io.on("connection",(socket)=>{
//     console.log("connected to socket")

//     socket.on('/listenDB',async (msg)=>{
//         console.log(msg)
       
//             socket.emit('/message',"hi")
//         })
// })

//   USER_COLLECTION.watch().on('change',async(data)=>{
    
//       var users=await User.find()
//       io.emit("/datachange",users)

//   })

server.listen(PORT,()=>{
    console.log(`connected to PORT : ${PORT}`)
})