import React, { useState } from 'react'
import logo from '../assets/logo.png'
import white_logo from '../assets/white_logo.png'
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {ClipLoader} from 'react-spinners'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
const SignIn = () => {
  const [showPassword,setShowPassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const [inputClicked,setInputClicked]=useState({
    username:false,
    password:false
  })
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState("")

  const navigate=useNavigate()
  const dispatch=useDispatch()

  const handleSignIn=async()=>{
    setLoading(true)
    setError("")
       try {
        
        const result=await axios.post(`${serverUrl}/api/auth/signin`,{
          username,password
        },{withCredentials:true})
        dispatch(setUserData(result.data))
        setLoading(false)
        console.log(result.data)
       } catch (error) {
        setError(error.response?.data?.message)
        setLoading(false)
        console.log(error)  
       }
  }

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
      
      <div className='w-[90%] lg:max-w-[60%] h-[600px]
      bg-white rounded-2xl flex justify-center items-center
      overflow-hidden border-2 border-[#1a1f23]'>
        
        <div className='w-full lg:w-[50%] h-full bg-white flex
        flex-col justify-center items-center p-[10px] gap-[20px]'>
          <div className='flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]'>
            <span>Sign In to</span>
            <img src={logo} alt="" className='w-[70px]'/>
          </div>
          {/* inputs */}

          <div className='relative flex items-center justify-start w-[90%]
          h-[50px] rounded-2xl  border-2 border-black' onClick={()=>setInputClicked({...inputClicked,username:true})}>

            <label  htmlFor="username" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white
            text-[15px] ${inputClicked.username?"top-[-15px]":""}`} >Enter Your Username</label>
            <input type="text" id='username'className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' 
            onChange={(e)=>setUsername(e.target.value)} value={username}/>
            
          </div>
          
          <div className='relative flex items-center justify-start w-[90%]
          h-[50px] rounded-2xl  border-2 border-black' onClick={()=>setInputClicked({...inputClicked,password:true})}>

            <label  htmlFor="password" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white
            text-[15px] ${inputClicked.password?"top-[-15px]":""}`} >Enter Password</label>
            <input type={showPassword?"text":"password"} id='password'className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0' 
            onChange={(e)=>setPassword(e.target.value)} value={password} required />
            
            {!showPassword?
            <IoIosEye className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={()=>setShowPassword(true)}/> 
            :<IoIosEyeOff className='absolute cursor-pointer right-[20px] w-[25px] h-[25px]' onClick={()=>setShowPassword(false)}/>}
          </div>

          <div onClick={()=>navigate("/forgot-password")} className='w-[90%] px-[20px] cursor-pointer'>Forgot Password</div>
          
          {error && <p className='text-red-500'>{error}</p>}

          <button onClick={handleSignIn} disabled={loading} className='w-[70%] px-[20px] py-[10px] bg-black text-white
          font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]'>
            {loading?<ClipLoader size={30} color='white'/>:"Sign In"}
          </button>
          
          <p>Want To Create a New account? <span className='border-b-2 border-b-black pb-[3px] text-black' 
          onClick={()=>navigate("/signup")}>Sign Up</span></p>
        </div>
        
        <div className='md:w-[50%] h-full hidden lg:flex
        justify-center items-center bg-[#000000] flex-col gap-[10px]
        text-white text-[16px]  font-semibold rounded-l-[30px]
        shadow-2xl shadow-black'>

          <img src={white_logo} alt="" className='w-[40%]' />
          <p>Not Just A Platform ,It's a vibe </p>
        </div>
      
      </div>
    
    </div>
  )
}

export default SignIn
