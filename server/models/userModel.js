import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type: String, 
        required: true
    },
    email:{
        type: String, 
        required: true,
        unique : true
    },
    password:{
        type: String, 
        required: true
    },
    //When ever new user is added , the verify otp will be defualt only 
    // Once user verified that will be presented in place of default 
    verifyOtp:{
        type:String,
        default:''
    },
    verifyOtpExpireAt:{
        type:Number ,
        default:0
    },
    // By default user mail will be as unverified only but after the verification status 
    // will change to true in plac of false 
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    //To reset Password 
    // Unless user request for an password rest, it will be default blanck only 
    resetOtp:{
        type:String,
        default:''
    },
    resetOtpExpireAt:{
        type:Number,
        default:0
    },

})

const userModel=mongoose.model.userSchema || mongoose.model('user',userSchema);
export default userModel;


// first verify otp and verifyotp expires at will be default null 
// If user requested for otp then it will be storedd in the databse forr 2 days and then value change to default
// I case user used that otp to verify then account will be verified and otp will be expired immediately 
