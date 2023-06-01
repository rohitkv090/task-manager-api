const request=require('supertest');
const app=require('../src/app');
const User=require('../src/models/users');
const jwt=require('jsonwebtoken');
const mongoose=require('mongoose');

const userOneId=new mongoose.Types.ObjectId();
const userOne={
    _id:userOneId,
    name:"Rohit",
    email:'rohitkv09@gmail.com',
    password:'hellobro',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
};
beforeEach(async ()=>{
    await User.deleteMany();
    await new User(userOne).save();
})

// afterEach(()=>{
//     console.log('afterEach');
// })

test('should signup a new user',async ()=>{
   const response=await request(app).post('/users').send({
        name:"Rohit Kumar",
        email:'rohitkv0900@gmail.com',
        password:'rohit123'
    }).expect(201);
    
    //assert that datase is changed correctly

    const user=await User.findById(response.body.user._id);
    expect(user).not.toBeNull();


    //assertion about the response

    // expect(response.body.user.name).toBe('Rohit Kumar'); we can also use the toMatchObject()

    expect(response.body).toMatchObject({
        user:{
            name:"Rohit Kumar",
            email:"rohitkv0900@gmail.com"
        }
    })
    expect(user.password).not.toBe('rohit123');
})

test('should login',async()=>{
    const response=await request(app).post('/users/login').send({
        email:'rohitkv09@gmail.com',
        password:'hellobro'
    }).expect(200);
    const user=await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);

})

test('should not login not existed user',async()=>{
    await request(app).post('/users/login').send({
    email:'rohtkv09@gmail.com',
    password:'hellobro'
    }).expect(400);
});

test('should get profile for user',async ()=>{
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
})

test('Should not get Profile for user',async()=>{
    await request(app).get('/users/me')
        .send().expect(401);
})

test('Should delete the user',async()=>{
    await request(app).delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user=await User.findById(userOne);
    expect(user).toBeNull();
})

test('Should not delete unauthenticated user',async ()=>{
    await request(app).delete('/users/me')
    .send()
    .expect(401);
})

