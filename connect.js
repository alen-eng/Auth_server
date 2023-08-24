const redis = require('redis')
const Redis = require("ioredis");
const mongoClient= require('mongodb').MongoClient
const state ={
  db:null
}
module.exports.connect=function(done){

 const url=process.env.MONGODB_URL
  const dbname='Auth'
 
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
