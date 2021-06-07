const express=require('express');
const auth=require('../middleware/auth');
const Tasks=require('../models/tasks');


const router=new express.Router()

router.post('/tasks',auth,async (req,res)=>{    //Old code
                                                // newTask.save().then((data)=>{
                                                //     res.status(201).send(data);
                                                // }).catch((error)=>{
                                                //     res.status(400).send(error);
                                                // })
    // const newTask=new Tasks(req.body)

    const newTask=new Tasks({
        ...req.body,
        owner:req.user._id
    })

   try {
       await newTask.save();
       res.send(newTask);
       
   } catch (error) {
       res.status(500).send(error);
       
   }

})
//we add additional query string like completed=true or false
//adding limit get/tasks
//GET sor
router.get('/tasks',auth,async (req,res)=>{

    const match={};
    const sort={};
    if(req.query.completed)
    {
        match.completed= req.query.completed==='true';

    }
    if(req.query.sortBy)
    {
        const parts=req.query.sortBy.split(':');
        sort[parts[0]]=parts[1]==='desc'?-1:1;
    }
    // Tasks.find({}).then((data)=>{
    //     res.send(data);
    // }).catch((error)=>{
    //     res.send(error);
    // })
    try{

        // const tasks=await Tasks.find({owner:req.user._id}); //or we can also populate the tasks

        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),//parse int because we are provided with query string
                skip:parseInt(req.query.skip),
                sort
            }
            // match:{
            //     completed:false
            // }
        }).execPopulate();
        res.send(req.user.tasks);
    }
    catch(e)
    {
        res.status(500).send()

    }
})

router.get('/tasks/:id',auth,async (req,res)=>{

    const _id=req.params.id;

    // Tasks.findById(_id).then((data)=>{
    //     if(!data)
    //         return res.status(404).send()
    //     res.send(data)
    // }).catch((error)=>{
    //     res.status(500).send(error);
    // })

    try{
        // const task=await Tasks.findById(_id)

        const task=await Tasks.findOne({_id,owner:req.user._id}); 
        if(!task)
            return res.status(404).send();
        res.status(201).send(task);
    }
    catch(e){
        res.status(500).send(e);

    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{


    const updates=Object.keys(req.body);
    const validUpdates=['completed','description'];
    const isValidOperation=updates.every((update)=>{

        return validUpdates.includes(update);
    })

    if(!isValidOperation)
        return res.status(400).send({error:'Invalid Updates'});
        
    try {
            // const task= await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
            // const task=await Tasks.findById(req.params.id);//now we need to give the user id and take the authentication also
            const task=await Tasks.findOne({_id:req.params.id,owner:req.user._id});
            

            if(!task)
                return res.status(404).send();

            updates.forEach((update)=>{
                task[update]=req.body[update];
            })

            await task.save();
            
            res.send(task);
            
    } catch (error) {
            res.status(400).send(error)
            
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{


    try {
        const task=await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id});
    if(!task)
        return res.status(404).send('Not task found');
    
    
    
            res.send(task);
        
    } catch (error) {
        res.status(500).send(error);
    }
    
})

module.exports=router;