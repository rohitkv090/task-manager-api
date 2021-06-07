const express=require('express');
require('./db/mongoose');
const userRouter=require('./routers/user');
const taskRouter=require('./routers/task');
const app=express()
const port=process.env.PORT;


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



const multer=require('multer');
const router = require('./routers/task');

 const upload=multer({
     dest:'images',
     limits:{
         fileSize:100000
     },
     fileFilter(req,file,cb)
     {
         if(!file.originalname.endsWith('.pdf'))
         {
             return cb(new Error(' Please upload a pdf'));
         }
         cb( undefined,true);

     }
 });


 router.post('/uploads',upload.single('upload'),(req,res)=>{
     res.send()
 },(error,req,res,next)=>{
     res.send({error:error.message})

 })





app.listen(port,()=>{
    console.log('Serer is running on port '+port);
})

const Tasks=require('../src/models/tasks');
const User=require('../src/models/users');
const tasks = require('../src/models/tasks');


 
