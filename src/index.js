const express=require('express');
require('./db/mongoose');
const userRouter=require('./routers/user');
const taskRouter=require('./routers/task');
const app=express()
const port=process.env.PORT;


app.use(express.json());// automatically convert incoming data into json
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
        //  cb(new Error('File must of a pdf extension'));
        //  cb(undefined,true);
        //  cb(undefinded,false);

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
// const main=async ()=>{
//     // const task=await Tasks.findById('60bbf17f3e4fcd3abc9d6079');
//     // await task.populate('owner').execPopulate();
//     // console.log(task);

//     const user=await User.findById('60bbf05aa9d58746d8d593dd');
//     await user.populate('tasks').execPopulate();

//     console.log(user.tasks);
// }
// main();


 
