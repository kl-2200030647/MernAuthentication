import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRoutes from './routes/authRoutes.js'
import userRoute from "./routes/userRoutes.js";

const app=express();

const port=process.env.PORT|| 2025;

connectDB();

const allowedOrigins=['http://localhost:3000']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins, credentials : true}));

//API ENDpoints 
app.get('/',(req,res)=>res.send("API WORKING"));
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoute);


app.listen(port,()=>
console.log(`server is running on port :${port}`));

// in package.json using only node , thne we have to rerun the application for the every single change made in the code 
// To avoid that nodemon is used and these lines are used 
//"start": "node server.js", 
   // "server": "nodemon server.js"
//Now to run thebackend use command npm run dev , in this case every minor change can be displayed in the browser 