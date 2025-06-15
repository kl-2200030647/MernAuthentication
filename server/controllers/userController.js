import userModel from "../models/userModel.js";

// To get All the users and their details 
export const getUserData=async(req,res)=>{
    try{
        // Here userId will be added to the body from the middleware
        const userId=req.userId;
        const user=await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User Not Found"})
        }
        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        });

    
    }catch(err){
        return res.json({success:false, message:err.message})
    }
}
