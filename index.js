import  Express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from './routes/user.js'
import postRoutes from './routes/posts.js'

 dotenv.config();
 const app=Express();
 
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use('/posts',postRoutes);
app.use('/users',userRoutes);
const CONNECTION_URL="mongodb+srv://ujjawal123:tyagi123@cluster0.aehuk.mongodb.net/?retryWrites=true&w=majority"
const PORT=process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL,{useNewUrlparser:true,useUnifiedtopology:true})
  .then(()=>app.listen(PORT,()=>console.log(`server running on port: ${PORT}`)))
  .catch((error)=>console.log(error))
   
// mongoose.set('userFindAndModify',false)