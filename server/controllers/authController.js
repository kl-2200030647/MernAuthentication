import userModel from './../models/userModel.js'
import bcrypt from 'bcryptjs'; // or 'bcrypt' if you're using that
//import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
//import userModel from './../models/userModel.js';
/*
const UserModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../sendEmail');
*/
 
// Written code for the registration , login , logi=out 
export const register=async(req,res)=>{
   const { name, email, password } = req.body;


    if(!name || !email || !password){
        return res.json({Success:false, message:'Missing Details'})
    }
    try{
        // If user exist with the input mailid then  excryption won't takes place 
        const existingUser=await userModel.findOne({email});
        //the encrypted password will be stored in the hashedPassword variable 
        //It gives high security but takes more time to encrypt
        if(existingUser){
            return res.json({Success:false, message:"User already exist"})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        //10 --> that many times password will be processes by hashing algorithm 
        // 10 is default one , more the number more the secure
        //Instead of original password hashed password will be stores in the database 
        const user= new userModel({name, email , password:hashedPassword})
        // this will save the user into userModel and stored in daabse 
        await user.save();

        //JWT tokens generation
        // When ever user._id created in the mongoDB databse , use that id to create token 
        // store that in the toekn variable 
        // Send this token to user based on response , response stroed as cookie 
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'}); 
       
        res.cookie('token',token ,{
            httpOnly:true ,
            secure: process.env.NODE_ENV==='production',
            sameSite :process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000  // this makes 7 days expiry for the cookie 
            //strict or none
            // for local --> strict when deploying , backend and frontedn in different domain then use none 
        }); //name,value and an object
        // http and secure used , in case of using local host then only http 
        // If the code in deployed and run in public then shows as https 
        // to decide secure to be true or false env variable is used 
        // in JS === is uswed to check the equality

        //----------ADDING EMAIL SENDING CONFIG------
        const mailOptions={
            from :process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Urban Company Clone',
            text:`Welcome to Urban Company Clone. Account created with email : ${email}`
        }
        
        await transporter.sendMail(mailOptions);
        return res.json({success:true})
    }catch(error){
        res.json({Success:false, message:error.message})
    }

}
export const login=async(req,res)=>{
    const {email,password}=req.body // get these from the login page as the input 
    // if email or password is wrong or not entered then message should be displayed 
    if( !email || !password){
        return res.json({Success:false, message :'Email and Password are required'})
    }
    try{
    const user=await userModel.findOne({email}); // check existance of the user
    if(!user){
        return res.json({status:false, message: ' Invalid email'})
    }
    //password from req body and password saved in DB
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.json({status:false, message: ' Invalid paasword'})
    }
    // token has to be generated here also 
    // if user exist with email and correct password then user has to do authentication , so use tokems 
    const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'}); 
       // Token is sending to the response to generate cookie 
        res.cookie('token',token ,{
            httpOnly:true ,
            secure: process.env.NODE_ENV==='production',
            sameSite :process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000  // this makes 7 days expiry for the cookie 
            //strict or none
            // for local --> strict when deploying , backend and frontedn in different domain then use none 
        }) ;
        return res.json({success:true})
    }catch(err){
        return res.json({success:false, message:err.message})
    }
}

///////////LOGOUT FUCNTION//////////////
export const logout =async(req,res)=>{
    try{
        // For loin and register we have created the tokens , now when we are logginout we have to remove tokens
        res.clearCookie('token',{
            httpOnly:true ,
            secure: process.env.NODE_ENV==='production',
            sameSite :process.env.NODE_ENV==='production'?'none':'strict',
            'none':'strict',

        });
        return res.json({success: true, message:"Logged Out "})

    }catch(err){
        return res.json({success: false, message : err.message})
    }
}

/// MAIL SENDING USING SMTP --> code in register it self/////

//---CODE FOR SENDING OTP ----//
export const sendVerifyOtp=async(req,res)=>{
    try{
        //get the user Id from input and store it 
        //const {userId}=req.body;
        const userId = req.userId;
        // as getting this from middleware not using the req.body()
        const user=await userModel.findById(userId);
        if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
        if(user.isAccountVerified){
            return res.json({success: false, message:"Account already Verified"});

        }
        // to generate otp use math random function
       const otp= String(Math.floor(100000+ Math.random()*900000));// generaye 6 digit otp randomly
       user.verifyOtp=otp;
       user.verifyOtpExpireAt=Date.now()+24*60*60*1000 // expires in a day 
       await user.save(); // save in the database 
       const mailOptions={
        from :process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Account Verification OTP',
        text:`Your OTP is : ${otp}. Verify account using this OTP.`
       }
       await transporter.sendMail(mailOptions);
       return res.json({success: true, message:'Verification OTP sent on email '});
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}
// If the otp is correct then account has to be verified 
// For that we have to use this function 
export const verifyEmail=async(req,res)=>{

    // Here getting the userId from the tokens from the cookies , as there is no direct input giving to it
    // By using token useid can be find 
    //that userId will be sent to the req.body (THIS REQUIRES AN MIDDLEWEAR FUNCTION )
    const userId = req.userId;
    const {otp}=req.body; // This is destructuring , which means getting fields from frontend by request
    // instead of importing 2 times here used single line to get the all fields of frontend 
    if(!userId || !otp){
        return res.json({success:false ,message :" Details are missing"})
    }
    try{
        const user =await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message:"User not found"});
        }
        if(user.verifyOtp ===' ' || user.verifyOtp!==otp){
            return res.json({success:false , message :" Invalid OTP"})
        }
        //Date.now() is the function is used to know todya's date
        if(user.verifyOtpExpireAt< Date.now()){
             return res.json({success:false , message :"OTP Expired "})
        }
        user.isAccountVerified=true;
        user.verifyOtp=' ';
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success : true, message :"Email verified successfully "})

    }catch(err){
        return res.json({success: false, message:err.message})
    }

}
// CHeck wether user is Authenticated or not 
export const isAuthenticated= async(req,res)=>{

    try{
        return res.json({success:true})
    }catch(err){
        return res.json({success:false, message:err.message})
    }
}

// controller to send password reset otp

export const sendResetOtp= async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"})
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'User not found'})
        }
        const otp= String(Math.floor(100000+ Math.random()*900000));// generaye 6 digit otp randomly
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000 // expires in 15 min 
        await user.save(); // save in the database 
        const mailOptions={
            from :process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            text:`Your OTP for resetting the password is : ${otp}. Use this OTP to proceed with resetting your password.`
        };

        await transporter.sendMail(mailOptions);
        return res.json({success:true , message:"OTP sent to your mail"})

    }catch(err){
        return res.json()
    }
}

// Reset User password 

export const resetPassword= async(req,res) =>{
    // to reset the password , needed emailid, otp and new password
    const {email,otp,newPassword}=req.body;

    if(! email || !otp ||!newPassword){
        return res.json({success:false, message:'Email, OTP and New Password are required '})

    }
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false, message:"User not found"})
        }
        // here if the otp given by user is not equals to the otp stored in the databse then user cannot get the mail 
        // to rest the password
        if(user.resetOtp ==="" || user.resetOtp!==otp){
            return res.json({success:false, message:"Invalid OTP "})
        }
        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false, message:" OTP Expired  "})
        }
        //if both the if cases are not there means user is able to reset the password
        // We have to encrypt the password to store in the databse 
        const hashedPassword= await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.resetPassword=' ';
        user.resetOtpExpireAt= 0 ;

        await user.save();
        return res.json({success: true, message:"Password has been reset successfully"})

    }catch(err){
        return res.json({success:false,message:err.message})
    }
}