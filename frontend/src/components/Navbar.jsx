import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import profile from '../assets/profile.jpg'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Navbar = () => {
    const navigate=useNavigate()
    const {userData}=useSelector(state=>state.user)
  return (
    <div className='w-[90%] lg:w-[40%] h-[80px] bg-black flex
    justify-around items-center fixed bottom-[20px] rounded-full
    shadow-2xl shadow-[#000000] z-[100]'>
        <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/')}>
            <GoHomeFill/>
        </div>
        <div 
        onClick={()=>navigate("/search")}
        className='text-white w-[25px] h-[25px] cursor-pointer'>
        <FiSearch />
        </div>
        <div className='text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate('/upload')}>
        <FiPlusSquare />
        </div>
        <div
        onClick={()=>navigate("/loops")}
        className='text-white w-[28px] h-[28px] cursor-pointer'>
            <RxVideo />
        </div>
        <div onClick={()=>navigate(`/profile/${userData.username}`)} className='w-[40px] h-[40px] border-2 border-black
            rounded-full cursor-pointer overflow-hidden'>
            <img src={userData.profileImage || profile} alt="" className='w-full object-cover' />
        </div>
    </div>
  )
}

export default Navbar
