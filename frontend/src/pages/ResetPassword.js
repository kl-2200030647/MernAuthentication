import React, { useContext, useState } from 'react'
import { assets } from '../asserts/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const {backendUrl}=useContext(AppContext);
  axios.defaults.withCredentials=true;
  const navigate=useNavigate();

  const [email,setEmail]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const inputRef=React.useRef([])
  const[isEmailSent,setIsEmailSent]=useState('');
  const[otp,setOtp]=useState(0);
  const[isOtpSubmitted,setIsOtpSubmitted]=useState(false);

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
  const onSubmitEmail=async (e)=>{
    e.preventDefault();
    try{
       const {data}=await axios.post(backendUrl+'/api/auth/send-reset-otp',{email})
       data.success? toast.success(data.message):toast.error(data.message)
        data.success && setIsEmailSent(true)
    }catch(error){
      toast.error(error.message)

    }
  }
  const submitOtp=async (e)=>{
    e.preventDefault();
    const otpArray=inputRef.current.map(e =>e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }
  const onSubmitNewPassword=async (e)=>{
    e.preventDefault();
    try{
      const {data}= await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword})
      if(data.success){
        toast.success(data.message);
        navigate('/login')
      }
      else{
        toast.error(data.message)
      }
      
    }catch(error){
      toast.error(error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br
    from-blue-200 to-purple-400'>
      <img src={assets.logo} alt="" onClick={()=>navigate('/')}
        className='absolute left-5 sm:left-20 top-5 w-28
        sm:w-32 cursor-pointer'/>
     {/*Enter email id  */} 

     {!isEmailSent &&
     <form onClick={onSubmitEmail}
     className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center md-4'>Reset Password </h1>
      <p className='text-indigo-300 text-center mb-6 '> Enter your registered email id  </p>
       <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C] '>
        <img src={assets.mail_icon} alt=" " className='w-3 h-3'/>
        <input type="email" placeholder="Email id"
        className='bg-transparent outline-none text-white' required 
        value={email} onChange={e=> setEmail(e.target.value)}  />


       </div>
       <button className='w-full py-3 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>Submit</button>

     </form>
      }



     {/** A new form again is used to enter the otp by the user to reset the password  */}
     {!isOtpSubmitted && isEmailSent &&
     <form onSubmit={submitOtp}
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
      <button className='w-full py-2.5 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'> Submit </button>
    </form>
}

{/*THIS FORM IS USED TO ENTER THE NEW PASSWORD  */}
{isOtpSubmitted && isEmailSent && 
    <form onSubmit={onSubmitNewPassword}
     className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
      <h1 className='text-white text-2xl font-semibold text-center md-4'>New Password </h1>
      <p className='text-indigo-300 text-center mb-6 '> Enter the new password below</p>
       <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C] '>
        <img src={assets.lock_icon} alt=" " className='w-3 h-3'/>
        <input type="password" placeholder="Password"
        className='bg-transparent outline-none text-white' required 
        value={newPassword} onChange={e=> setNewPassword(e.target.value)}  />


       </div>
       <button className='w-full py-3 text-white rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900'>Submit</button>

     </form>
}

    </div>
  )
}

export default ResetPassword
