const db=require("./index")

db.connect((err)=>{
    if(err)
      console.log('Database not connected!!'+err);
    else
    console.log('Database connected successfully!!');
  })