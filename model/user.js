// const mongoose=require("mongoose")

// const userSchema=mongoose.Schema({

//     phone:{
//         required:true,
//         type:Number,
//         trim:true,
//         validate:{
//             validator:(val)=>{
//                 const re = /^\d{10}$/
                
//                 return val.match(re)
//             },
//             message:'incorrect number format'

//         }
//     },
//     password:{
//         required:true,
//         type:String,
        
//     }

// })
// const User=mongoose.model('user',userSchema)
// module.exports=User


module.exports={
    USER_COLLECTION:'users',
    CHILD_COLLECTION:'child'
}


// const mongoClient= require('mongodb').MongoClient
// const state ={
//     db:null
// }
// module.exports.connect=function(done){
//     //const Password=process.env.tvZwiltv8ylWVSkA
//    const url= 'mongodb+srv://Admin-007:tvZwiItv8yIWVSkA@cluster-007.kxziv.mongodb.net/Cluster-007';
//     //const url='mongodb://localhost:27017'
//     const dbname='trackapp'

//     mongoClient.connect(url,(err,data)=>{
//         if(err) return done(err)
//         state.db=data.db(dbname)
//         done()
//     })

// }

// module.exports.get=function(){
//     return state.db
// }