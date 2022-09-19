const express =require("express")
const bcrypt=require("bcryptjs")
const webtoken=require("jsonwebtoken")
const collection = require("../model/user")
const db =require("../index")
const authRouter=express.Router()
var ObjectID=require('mongodb').ObjectId

authRouter.post("/signup",async(req,res)=>{

    console.log("authenticating")

        //try{
            const {phone,password}=req.body
            console.log(phone)
            const existingUser= await db.get().collection(collection.USER_COLLECTION).findOne({phone:phone})
            
            if(existingUser){
                return res.status(400).json({msg:"Phone number Already Exists"})
            }
        
            const hashedpassword=bcrypt.hashSync(password,8)
            
            // let user=new User({
            //     phone,
            //     password:hashedpassword,
            console.log("Checking..")
            db.get().collection(collection.USER_COLLECTION).insertOne({phone:phone,password:hashedpassword}).then((response)=>{
                return res.status(200).json(response)
            })
            
        //     user= await user.save()
        //    return res.status(200).json(user)
      //   }catch(e){
         //       return res.status(500).json({error:e.message})
     //    }
})
//)

authRouter.post("/signin",async(req,res)=>{
        
      console.log("trying to sign in")
        
        const {phone,password}=req.body;

        const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({phone:phone});
        console.log(existinguser)
        if(existinguser==null){
            return res.status(400).json({msg:"Invalid Phone"})
        }

        const isCorrect=await bcrypt.compare(password, existinguser.password)
        
        
        if(isCorrect==false){
            // console.log("incorrect password")
            return res.status(400).json({msg:"Incorrect password"})
        }

        const token=webtoken.sign({id:existinguser._id},"webtokenkey")
        
        var user=existinguser._doc
        return res.status(200).json({token:token,phone:existinguser['phone']})
    // }catch(e){
    //    return res.status(500).json({error:e.message})
    // }
              
})

authRouter.post("/tokengen",async(req,res)=>{
console.log("Token generation..")
const{token,phone}=req.body;

const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({phone:phone});
console.log(existinguser)
const parentoken=webtoken.sign({id:existinguser._id},"webtokenkey")

//db.get().collection(collection.USER_COLLECTION).insertOne({token:parentoken})
db.get().collection(collection.USER_COLLECTION).updateOne({phone:phone},
    {

       $set:{
          token:parentoken
             }

   })
.then((response)=>{
    return res.status(200).json(parentoken)
})

})
authRouter.post("/entertoken", async(req,res)=>{
   // console.log(user.phone);
console.log("Enter token");
//const {token,user}=req.body
token=req.body.actual
user=req.body.user
var obj=JSON.parse(user)
var phone=obj.phone
const existinguser= await db.get().collection(collection.USER_COLLECTION).findOne({token:token});
console.log(existinguser)
if(existinguser){
    await db.get().collection(collection.CHILD_COLLECTION).insertOne({child:phone,parent:existinguser['phone'],location:"",battery:""});
    return res.status(200).json({token:token,phone:existinguser['phone']})
}
else if(existinguser==null){
    return res.status(400).json({msg:"Invalid Token"})
}
})

authRouter.post("/parentcheck", async(req,res)=>{
 console.log("parent..");
 var phone=req.body.phone
 const parent= await db.get().collection(collection.CHILD_COLLECTION).findOne({parent:phone});
 const child= await db.get().collection(collection.CHILD_COLLECTION).findOne({child:phone});
 if(parent){
     return res.status(200).json({msg:"PARENT",child:parent.child,location:parent.location,battery:parent.battery})
 }
 else if(child){
     return res.status(200).json({msg:"CHILD",parent:child.parent})
 }
 else if(parent==null && child==null){
    return res.status(200).json({msg:"NOT"})
}
 })
authRouter.post("/loc_update", async(req,res)=>{
    console.log("Location..update..")
location=req.body.location
user=req.body.user
battery=req.body.battery
var obj=JSON.parse(user)
var child=obj.phone
var obj=await db.get().collection(collection.CHILD_COLLECTION).updateOne(
    {child:child},
    {
        $set:{
            location:location,
            battery:battery
        }
    }
    );
if(obj){
    return res.status(200).json({msg:"Success"})
}
    else if(obj==null){
        return res.status(400).json({msg:"Error"})
    }

})

authRouter.post("/loc_fetch", async (req,res)=>{
    console.log("Location...fetch...")
    user=req.body.user
var obj=JSON.parse(user)
var parentph=obj.phone
const location= await db.get().collection(collection.CHILD_COLLECTION).findOne({parent:parentph});
if(location){
return location}
else if(location==null){
    return "Error";
}
})
module.exports=authRouter