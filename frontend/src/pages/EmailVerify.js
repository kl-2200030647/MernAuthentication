import React, { useContext, useEffect } from 'react'
import { assets } from '../asserts/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const navigate=useNavigate()
   
  axios.defaults.withCredentials=true; 
  // add cookies into the web 
  const inputRef=React.useRef([])

  const {backendUrl,isLoggedIn,userData, getUserData}=useContext(AppContext) 
       
  useEffect(() => {
  if (isLoggedIn && userData?.isAccountVerified) {
    navigate('/');
  }
}, [isLoggedIn, userData]);

  // This is used to move to the next box after entering first number in first box 
  const handleInput=(e,index)=>{
    if(e.target.value.length>0 && index<inputRef.current.length-1){
        inputRef.current[index+1].focus();
    }

  }
  const handleKeyDown=(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
     inputRef.current[index - 1].focus();
    }
  }
  const handlePaste=(e)=>{
    const paste=e.clipboardData.getData('text')
    const pasteArray=paste.split('');
    pasteArray.forEach((char,index)=>{
      if(inputRef.current[index]){
        inputRef.current[index].value=char;
      }
    })
  }

    const onSubmitHandler=async(e)=>{
      e.preventDefault(); //This will not reload the page if we submit the form 
      try{
        const otpArray=inputRef.current.map((e)=>e.value)
        const otp=otpArray.join('')

        const {data}=await axios.post(backendUrl+'/api/auth/verify-email',{otp})
        console.log(data);
        if(data.success){
          toast.success(data.message)
          //await user.save();
          const success = await getUserData(); // ✅ Wait for data and set isLoggedin
            if (success) {
              navigate('/');
            }

          } else {
            toast.error(data.message);
          }
      } catch (error) {
        console.error("OTP Verify Error:", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }

    }
    





  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 
    bg-gradient-to-br from-blue-200 to-purple-400'>
      <img src={assets.logo} alt="" onClick={()=>navigate('/')}
            className='absolute left-5 sm:left-20 top-5 w-28
            sm:w-32 cursor-pointer'/>

    <form onSubmit={onSubmitHandler}
    className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center md-4'>Email Verify OTP </h1>
      <p className='text-indigo-300 text-center mb-6 '> Enter the OTP sent to your registered email id  </p>
       
       {/** To enter OTP from the frontend which is received in gmail */}
      <div className='flex justify-between mb-8' onPaste={handlePaste}>
        {Array(6).fill(0).map((_,index)=>(
          <input type="text" maxLength='1' key={index} required
          className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
          ref={e=> inputRef.current[index] =e }
          onInput={(e)=> handleInput(e,index)}
          onKeyDown={(e)=>handleKeyDown(e,index)}/>
          
        ))}
        {/** This will add index for all the input fields  */}

      </div>
      <button className='w-full py-3 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'> Verify Email </button>


    </form>
    </div>
  )
}

export default EmailVerify
