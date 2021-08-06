const app=require('./app');


const port=process.env.PORT;


app.listen(port,()=>{
    console.log('Serer is running on port '+port);
})



 
