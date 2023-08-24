const express =require("express")
const bcrypt=require("bcryptjs")
const Redis = require("ioredis");
const jwt=require("jsonwebtoken")
const collection = require("../model/user")
const db =require("../connect");
var ObjectID=require('mongodb').ObjectId
const authRouter=express.Router()
var ObjectID=require('mongodb').ObjectId

authRouter.post("/signup",async(req,res)=>{
   
console.log(req.body)
            const {firstname,lastname,email,password}=req.body
            console.log(firstname)
            const existingUser= await db.get().collection(collection.USER_COLLECTION).findOne({email:email})
            
            if(existingUser){
                return res.status(400).json({msg:"Email already exists"})
            }
const hashedpassword=bcrypt.hashSync(password,8)

            db.get().collection(collection.USER_COLLECTION).insertOne({Firstname:firstname,Lastname:lastname,Email:email,Password:hashedpassword}).then((response)=>{
                return res.status(200).json({status:200 , msg:"User Registered Successfully"})
            })
            
})

authRouter.post("/signin",async(req,res)=>{
    const client = new Redis(String(process.env.REDIS_URL));
        const {email,password}=req.body;

        const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({Email:email});
        
        if(existinguser==null){
            return res.status(400).json({status:400,msg:"Email not registered yet!!"})
        }
  
        const isCorrect=await bcrypt.compare(password, existinguser.Password)
        
        if(isCorrect==false){
            // console.log("incorrect password")
            return res.status(403).json({status:403,msg:"Incorrect password"})
        }
      else {
        const accesstoken=jwt.sign({email:existinguser.Email},"accessecrete",{expiresIn:"2m"})
        const refreshtoken=jwt.sign({email:existinguser.Email},"refreshsecrete",{expiresIn:"30d"})
         
        const id=String(existinguser._id)
        client.set(id,JSON.stringify({refreshtoken:refreshtoken}),'EX',60*60*24*30,);
        return res.status(200).json(
            {status:200,name:existinguser['Firstname'],User:existinguser._id,accesstoken:accesstoken}
            )
    
      }        
})

authRouter.post("/refresh",async(req,res)=>{
const client = new Redis(String(process.env.REDIS_URL));
const{user}=req.body;

const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(user)});
const googleuser= await db.get().collection(collection.GOOGLE_COLLECTION).findOne({_id:ObjectID(user)});
const githubuser= await db.get().collection(collection.GITHUB_COLLECTION).findOne({_id:ObjectID(user)});
if(!existinguser && !googleuser && !githubuser){
    return res.status(400).json({status:400,msg:"User not found"})
}
if(existinguser){
    client.get(existinguser._id).then((result) => { 
              if(result!=null && result!=undefined){
                const accesstoken=jwt.sign({email:existinguser.Email},"accessecrete",{expiresIn:"2m"})
                return res.status(200).json({status:200,accesstoken:accesstoken})
              }
              else return res.status(402).json({status:402,msg:"Please login again"})
}
)}
else if(googleuser){
    client.get(googleuser._id).then((result) => { 
        if(result!=null && result!=undefined){
          const accesstoken=jwt.sign({email:googleuser.Email},"accessecrete",{expiresIn:"2m"})
          return res.status(200).json({status:200,accesstoken:accesstoken})
        }
        else return res.status(402).json({status:402,msg:"Please login again"})
}
)}
else if(githubuser){
    client.get(githubuser._id).then((result) => {
        if(result!=null && result!=undefined){
          const accesstoken=jwt.sign({email:githubuser.Email},"accessecrete",{expiresIn:"2m"})
          return res.status(200).json({status:200,accesstoken:accesstoken})
        }
        else return res.status(402).json({status:402,msg:"Please login again"})
    })

} })

authRouter.post("/type",async(req,res)=>{
    const{usertype,value,user}=req.body;
    
    const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(user)});
    const googleuser= await db.get().collection(collection.GOOGLE_COLLECTION).findOne({_id:ObjectID(user)});
    const githubuser= await db.get().collection(collection.GITHUB_COLLECTION).findOne({_id:ObjectID(user)});
    if(!existinguser && !googleuser && !githubuser){
        return res.status(400).json({status:400,msg:"User not found"})
    }
    if(existinguser){
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectID(user)},{
            $set:{
                type:usertype,
                typeName: value,
            }
            })           
    }
    else if(googleuser){
        db.get().collection(collection.GOOGLE_COLLECTION).updateOne({_id:ObjectID(user)},{
            $set:{
                type:usertype,
                typeName: value,
            }
            })
    }
    else if(githubuser){
        db.get().collection(collection.GITHUB_COLLECTION).updateOne({_id:ObjectID(user)},{
            $set:{
                type:usertype,
                typeName: value,
            }
            })
    }
    return res.status(200).json({status:200,msg:"User type updated"})
    
    })

    authRouter.post("/host",async(req,res)=>{
        const{hostingtype,user}=req.body;
        const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(user)});
        const googleuser= await db.get().collection(collection.GOOGLE_COLLECTION).findOne({_id:ObjectID(user)});
        const githubuser= await db.get().collection(collection.GITHUB_COLLECTION).findOne({_id:ObjectID(user)});

        if(!existinguser && !googleuser && !githubuser){
            return res.status(400).json({status:400,msg:"User not found"})
        }
        if(existinguser){
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectID(user)},{
                $set:{
                    HostType:hostingtype,
                }
                })           
        }
        else if(googleuser){
            db.get().collection(collection.GOOGLE_COLLECTION).updateOne({_id:ObjectID(user)},{
                $set:{
                    HostType:hostingtype,
                }
                })
        }
        return res.status(200).json({status:200,msg:"Host type updated"})
        
        })

        authRouter.post("/option",async(req,res)=>{
            const{hostingOption,repo,user}=req.body;
            const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(user)});
            const googleuser= await db.get().collection(collection.GOOGLE_COLLECTION).findOne({_id:ObjectID(user)});
            const githubuser= await db.get().collection(collection.GITHUB_COLLECTION).findOne({_id:ObjectID(user)});

            if(!existinguser && !googleuser && !githubuser){
                return res.status(400).json({status:400,msg:"User not found"})
            }
            if(existinguser){
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectID(user)},{
                    $set:{
                        HostOption:hostingOption,
                        RepoLink:repo
                    }
                    })           
            }
            else if(googleuser){
                db.get().collection(collection.GOOGLE_COLLECTION).updateOne({_id:ObjectID(user)},{
                    $set:{
                        HostOption:hostingOption,
                        GitLink:repo
                    }
                    })
            }
            return res.status(200).json({status:200,msg:"Git link updated"})
            
            });



    authRouter.post("/auth/google",async(req,res)=>{
            const client = new Redis(String(process.env.REDIS_URL));
        const {name,email}=req.body;
 console.log(name,email)
        const existinguser= await db.get().collection(collection.GOOGLE_COLLECTION).findOne({Email:email});
        
        if(existinguser==null){
            db.get().collection(collection.GOOGLE_COLLECTION).insertOne({Fullname:name,Email:email});
            const user = await db.get().collection(collection.GOOGLE_COLLECTION).findOne({Email:email});
                const id=String(user._id)
                const accesstoken=await jwt.sign({email:user.Email},"accessecrete",{expiresIn:"2m"})
                const refreshtoken= await jwt.sign({email:user.Email},"refreshsecrete",{expiresIn:"30d"})
                client.set(id,JSON.stringify({refreshtoken:refreshtoken}),);
                return res.status(202).json({status:200,name:user['Fullname'],User:user._id,accesstoken:accesstoken})
        
        }
      else {
        const accesstoken=jwt.sign({email:existinguser.Email},"accessecrete",{expiresIn:"2m"})

        return res.status(200).json(
            {status:200,name:existinguser['Fullname'],User:existinguser._id,accesstoken:accesstoken}
            )
        }
      });

      authRouter.post("/auth/github",async(req,res)=>{
        const client = new Redis(String(process.env.REDIS_URL));
    const {name,email}=req.body;
console.log(name,email)
    const existinguser= await db.get().collection(collection.GITHUB_COLLECTION).findOne({Email:email});
    
    if(existinguser==null){
        db.get().collection(collection.GITHUB_COLLECTION).insertOne({Fullname:name,Email:email});
        const user = await db.get().collection(collection.GITHUB_COLLECTION).findOne({Email:email});
            const id=String(user._id)
            const accesstoken=await jwt.sign({email:user.Email},"accessecrete",{expiresIn:"2m"})
            const refreshtoken= await jwt.sign({email:user.Email},"refreshsecrete",{expiresIn:"30d"})
            client.set(id,JSON.stringify({refreshtoken:refreshtoken}),);
            return res.status(202).json({status:200,name:user['Fullname'],User:user._id,accesstoken:accesstoken})
    
    }
  else {
    const accesstoken=jwt.sign({email:existinguser.Email},"accessecrete",{expiresIn:"2m"})

    return res.status(200).json(
        {status:200,name:existinguser['Fullname'],User:existinguser._id,accesstoken:accesstoken}
        )
    }
  });
       

module.exports=authRouter
