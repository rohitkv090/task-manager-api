const mongoose=require('mongoose');
const validator=require('validator');
const bycrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Tasks=require('./tasks');

const userSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true,
            trim:true
        },
        age:{
            type:Number,
            default:0
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            validate(value)
            {
                if(!validator.isEmail(value))
                    throw new Error ('Email is invalid');
            }
        },
        password:{
            type:String,
            require:true,
            trim:true,
            validate(value)
            {
                if(value.length<6||value.toLowerCase()==="password")
                    throw new Error ('Passoword must be greater than 6 characters and not password')
            }
    
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }],
        avatar:{
            type:Buffer
        }
    },{
        timestamps:true//at two fields to the user createdAt,updateAt
    }
);
userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email:email});
    if(!user)
    {
        throw new Error('Unable to login');
    }
    const isMatch=await bycrypt.compare(password,user.password);

    if(!isMatch)
    {
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.methods.generateAuthToken=async function()
{
   const user=this;
   const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
   user.tokens=user.tokens.concat({token:token})
   await user.save();
   return token;
}

userSchema.methods.toJSON= function()
{
    const user=this;
    const userObject=user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject; 

    
}

userSchema.virtual('tasks',{
    ref:'tasks',
    localField:'_id', 
    foreignField:'owner'
})

userSchema.pre('save',async function(next){
    
    const user=this;

    if(user.isModified('password'))
    {
        
        user.password=await bycrypt.hash(user.password,8);
    }

    next();
})


userSchema.pre('remove',async function(next){
    const user=this;
    
    await Tasks.deleteMany({owner:user._id});


    next();
})

const User=mongoose.model('User',userSchema)

module.exports=User;