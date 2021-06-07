const express=require('express');
const auth=require('../middleware/auth');
const Tasks=require('../models/tasks');


const router=new express.Router()

router.post('/tasks',auth,async (req,res)=>{
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

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
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
    try{
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