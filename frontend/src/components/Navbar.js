import React, { useContext } from 'react'
import { assets } from '../asserts/assets'
import {useNavigate} from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
//className in React + Tailwind is not for naming elements — it’s for applying utility CSS classes directly.


const Navbar = () => {
  const navigate= useNavigate();
  const {userData,backendUrl,setUserData, setIsLoggedin}=useContext(AppContext)

    const sendVerificationOtp= async()=>{
      try{
        axios.defaults.withCredentials=true;
        const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp')

        if(data.success){
          navigate('/email-verify')
          toast.success(data.message)
        }
        else{
          toast.error(data.message)
        }
      }catch(error){
          toast.error(error.message)
      }
    }

  const logout=async()=>{
      axios.defaults.withCredentials = true;
      try{
          axios.defaults.withCredentials=true
          const {data} =await axios.post(backendUrl+'/api/auth/logout')
          console.log("Logout response:", data); // ✅ Debug log
          
          if(data.success){
          setIsLoggedin(false)
          setUserData(null)
          navigate('/')
          }else {
      toast.error(data.message || "Logout failed");
    }
      }catch(error){
        console.error("Logout error:", error); 
          toast.error(error.message)
      }
    }


  // this helps to move from one webpage to an=other 
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
     
      <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
      {userData ?
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
          {userData.name[0].toUpperCase()}
          {/* Here we are using the hidden in css , means by default 
          it wont appear but  */}

          {/** Here checking that user is verified or not , if not verified then veridy email wil be showm 
           * else it is neglected 
           */}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified && 
              <li onClick={sendVerificationOtp}
              className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
              {/** If user is alredy verified then this should not be shown , should be hidden */}
             
                
             <li onClick={logout} className='px-2 py-1 hover:bg-gray-200 cursor-pointer pr-10'>Logout </li>{/**pr-10 is used becoz it is  a small word and 
               * verify emil is big word , her padding is done on right , this helps to align both in same position 
               */}
            </ul>
          </div>
      </div> :
      
      <button onClick={()=>navigate('/login')}
      className='flex items-center gap-2 border-gray-500 rounded-full px-6 py-2 test-grey-800 hover: bg-gray-100
      transition-all'>Login <img src={assets.arrow_icon} alt=" "/></button>}
    </div>
  )
}

export default Navbar


