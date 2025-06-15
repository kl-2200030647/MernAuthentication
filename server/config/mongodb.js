import mongoose from "mongoose";


// this file is mainly used for the mongobd connection using the env , instead of writting in server.js written here and imported into Server.js 

const connectDB= async()=>{
    mongoose.connection.on('connected',()=> console.log("Database Connected Successfully"));

    await mongoose.connect(`${process.env.MONGODB_URL}`);

};
export default connectDB;