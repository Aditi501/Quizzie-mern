const express=require('express');
require('dotenv').config();
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const authRoute=require('./routes/auth');
const quizRoute=require('./routes/quiz')
const port= process.env.PORT
const path =require('path');
const url= require ('url');



const corsOptions = {
  allowedHeaders: ['Authorization', 'Content-Type'], }

app.use(cors(corsOptions));


app.use(express.json())

//app.use(cors())
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("Database Connected"))
.catch((error)=>console.log(error))



app.get('/api/quiz',(req,res)=>{
    console.log("Quiz working");
    res.json({
        service: "Quiz Server Working",
        status:"success",
        time: new Date()
    })
})

app.use((error,req,res,next)=>{
    console.log(error)
    res.status(500).json({message:"Something went wrong"})
  })

  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/quiz", quizRoute);
app.listen(port, () => {
    console.log(`Backend server running at port ${port}`);
  });