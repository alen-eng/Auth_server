// const db=require("./index")

// db.connect((err)=>{
//     if(err)
//       console.log('Database not connected!!'+err);
//     else
//     console.log('Database connected successfully!!');
//   })
const mongoClient= require('mongodb').MongoClient
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