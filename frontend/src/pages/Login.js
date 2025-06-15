 

// stores the all states and folders of the application 
import React, { useContext, useState } from 'react'
import { assets } from '../asserts/assets';
import {  useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate=useNavigate();

     const {backendUrl,setIsLoggedin , getUserData}=useContext(AppContext) 
     
     const [state,setState]= useState('Sign Up');
     const [formData, setFormData] = useState({
       name: '',
       email: '',
       password: ''
     });
    const onSubmitHandler= async (e)=>{
      e.preventDefault();// prevent the default behaviour and update the data of form 
      try{
        axios.defaults.withCredentials=true
        {/*if(state==='Sign Up'){
           const {data}= await axios.post(backendUrl+'/api/auth/register',{name,email,password})
           if(data.success){
            setIsLoggedin(true)
            getUserData()
            console.log("Login successful. Redirecting...");
      navigate('/');
          }else{
              toast.error(data.message)
           }
        }else{
           const {data}= await axios.post(backendUrl+'/api/auth/login',{email,password})
           if(data.success){
            setIsLoggedin(true)
            getUserData()
            console.log("Login successful. Redirecting...");
      navigate('/');
          }else{
              toast.error(data.message)
           }

        }
        console.log(state)*/}
        {/** Before used axios 2 times so it created a mess now changed to here and next onwards use this 
          only , this will help to redirect correctly  */}
        const endpoint = state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        state === 'Sign Up'
          ? formData
          : { email: formData.email, password: formData.password };

      const response = await axios.post(backendUrl + endpoint, payload);

      // 4️⃣ On success, update context and navigate
      if (response.data.success || response.data.sucess) { // typo-safe
        await getUserData();
        setIsLoggedin(true);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }

      }catch (error) {
       // toast.error(error?.response?.data?.message || "Something went wrong");
        toast.error(error.message || "Something went wrong");
      }


    }
 
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 
    bg-gradient-to-br from-blue-200 to-purple-400'>
      <img src={assets.logo} alt="" onClick={()=>navigate('/')}
      className='absolute left-5 sm:left-20 top-5 w-28
      sm:w-32 cursor-pointer'/>
      {/*Here below lines helps to create the box */}
      <div className=' bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 test-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create account' : ' Login'}
        </h2>

        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {/*For sign up all 3 are required for 
          login no need of name so remove that */}

          {state==='Sign Up' &&(
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C] '>
            <img src={assets.person_icon} alt=" "/>
            <input className='bg-transparent outline-none ' 
            onChange={e=>setFormData({ ...formData,name:e.target.value})} value={formData.name}
            type="text" placeholder='Full Name' required />
          </div>
          )}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C] '>
            <img src={assets.mail_icon} alt=" "/>
            <input  className='bg-transparent outline-none '
            onChange={e=>setFormData({...formData,email:e.target.value})} value={formData.email}
            type="email" placeholder='Email id' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5
          rounded-full bg-[#333A5C] '>
            <img src={assets.lock_icon} alt=" "/>
            <input className='bg-transparent outline-none '
            onChange={e=>setFormData({...formData,password:e.target.value})} value={formData.password}
            type="password" placeholder='Password' required />
          </div>
          <p onClick={()=>navigate('/reset-password')}
          className='mb-4 text-indigo-500 cursor-pointer'>Forget Password?</p>
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to indigo-900 text-white font-medium '
            > {state} </button>
        </form>
        {state==='Sign Up'?(<p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}
          <span onClick={()=> setState('Login')}
             className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>):
        (<p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}
          <span onClick={()=> setState('Sign Up')}
          className='text-blue-400 cursor-pointer underline'>Sign here</span>
        </p>)}
        
        
      </div>
    </div>
  )
}

export default Login
// Span is used to add the style to that word different from beofreword 
//Here for login here we have to naviage to new Page 
