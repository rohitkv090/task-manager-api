const mongoose=require('mongoose');

mongoose.connect( process.env.MONGOGB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true
});

// const User=mongoose.model('User',{
//     name:
//     {
//         type:String,
//         required:true,
//         trim:true
//     },
//     age:{
//         type:Number,
//         default:0
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(value)
//         {
//             if(!validator.isEmail(value))
//                 throw new Error ('Email is invalid');
//         }
//     },
//     password:{
//         type:String,
//         require:true,
//         trim:true,//we can also use minlenght property for checking the length of the password
//         validate(value)
//         {
//             if(value.length<6||value.toLowerCase()==="password")//we can also use value.include("password")
//                 throw new Error ('Passoword must be greater than 6 characters and not password')
//         }

//     }
// })

// const me=new User({name:"            Ashish        ",email:"    addshfskjfdf@dfkjd.com     ",password:"Password"});
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{console.log(error)});

// const tasks=mongoose.model('tasks',{
//     description:{
//         type:String,
//         trim:true,
//         required:true

//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const newTasks=new tasks({
//     description:"Done the challenge",
//     completed:true
// });

// newTasks.save().then((data)=>{console.log(data)}).catch((error)=>{console.log(error)});

