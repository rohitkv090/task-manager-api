const express=require('express');
const User=require('../models/users')
const auth=require('../middleware/auth');
const router=new express.Router();
const sharp=require('sharp');
const multer=require('multer');
const {sendWelcomeMail,sendAccountDeleteMail}=require('../emails/account');


router.post('/users',async (req,res)=>{

    const user=new User(req.body)

    // user.save().then((data)=>{
    //     res.status(201).send(data);
    // }).catch((error)=>{
    //     res.status(400).send(error);
    // });

    try {
        await user.save();
        console.log(user.email,user.name);
        sendWelcomeMail(user.email,user.name);
        const token =await user.generateAuthToken();
        res.status(201).send({user,token:token});
        
    } catch (error) {
        res.status(500).send(error);
        
    }
    
})


router.post('/users/login',async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password);
        const token=await user.generateAuthToken();
        res.send({user,token});
        
    } catch (error) {
        res.status(400).send(error);
        
    }
})

router.post('/users/logout',auth,async(req,res)=>{  
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token;

        })
       
      
        await req.user.save();
        res.send();
        
    } catch (error) {
        res.status(500).send(error);
        
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{  
    try {
          req.user.tokens=[]
          await req.user.save();
          res.send();
          
      } catch (error) {
          res.status(500).send(error);
          
      }
  })

router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user);

})

// router.get('/users/:id',async(req,res)=>{
//     const _id=req.params.id;
//     // User.findById(_id).then((data)=>{
//     //     if(!data)
//     //         return res.status(404).send();
//     //     res.send(data);
//     // }).catch((error)=>{
//     //     res.send(error);
//     // })

    
//     try{
//         const user=await User.findById(_id);
//         if(!user)
//             return res.status(404).send('User not found');
//         res.send(user)
//     }
//     catch(e)
//     {
//         res.status(500).send();
//     }
// })
router.patch('/users/me',auth,async (req,res)=>{

    const updates=Object.keys(req.body);
    const validUpdates=['name','password','email','age'];
    const isValidOperation=updates.every((update)=>{
        return validUpdates.includes(update);
    })
    if(!isValidOperation)
        return res.status(400).send({error:'Invalid Updates'});

    try{

        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});//new return new user after update we will not use this because it bypass some basic mongoose functionality ,so we will hard code it

        // const user=await User.findById(req.user._id); //don't need this because we can access the user data from auth function
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        });

        await req.user.save();

        res.send(req.user);
    }
    catch(e)
    {
        res.status(400).send(e);
    }

})

router.delete('/users/me',auth,async(req,res)=>{
    try {

        // const user=await User.findByIdAndDelete(req.user._id)//we users id from authentication as it is returning us the user 
        // if(!user)
        // {
        //     return res.status(404).send('User not found');
        // }
        await req.user.remove();//using the remove function that is provided by the mongoose
        sendAccountDeleteMail(req.user.email,req.user.name);
        res.send(req.user)
        
    } catch (error) {
        res.status(500).send()
        
    }
})

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb)//file is the file we are using ,cb is the callback function
    {
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/))
        {
            return cb(new Error('Please upload only jpg,jpeg,png image files'))

        }
        cb(undefined,true);
    }
});

router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar)
            throw Error();

        res.set('Content-Type','image/png');
        res.send(user.avatar);
        
    } catch (error) {
        res.status(400).send({error});
    }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{

    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar=buffer;
     await req.user.save();
    
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined;
    await req.user.save()
    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error});
})

module.exports=router;