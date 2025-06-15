import jwt from "jsonwebtoken";
{/*
const userAuth=async(req,res,next)=>{
    const{token}=req.cookies;   // get token from cookie

    if(!token){
        return res.json({sucess:false, message :"Not Authorized, Login Again "})
    }
    try{
        // Check wether the got jwt token is correct or not
        const tokenDecode=jwt.verify(token, process.env.JWT_SECRET)
        // if the token has id then it will be added to request id using property userid
        if(tokenDecode.id){
            req.body.userId=tokenDecode.id; 
        }
        else{
            return res.json({sucess:false, message :"Not Authorized, Login Again "})
        }
        // now next() will call (or) execute the controller function 
        next();

    }catch(err){
        return res.json({success: false,message:err.message})
    }

}

export default userAuth;

// using the middleware and controllercide will create api end point 

// API end point is nothing but the address(HTTP+URL)
*/}
//import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;  // JWT stored in cookies

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id) {// This line is change from the above code 
      req.userId = decoded.id;  // ✅ attach to req safely
      next();
    } else {
      return res.json({ success: false, message: "Invalid token" });
    }

  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export default userAuth;
