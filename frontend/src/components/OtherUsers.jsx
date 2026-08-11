import React from 'react'
import profile from '../assets/profile.jpg'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'
const OtherUsers = ({user}) => {
  const navigate=useNavigate()
  return (
    <div className='w-full h-[80px] flex items-center
    justify-between border-b-2 border-gray-800'>
        <div className='flex items-center gap-[10px]'>
          <div className='w-[70px] h-[70px] border-2 border-black
        rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${user.username}`)}>
          <img src={user.profileImage || profile} alt="" className='w-full object-cover' />
        </div>
        <div>
          <div className='text-[18px] text-white font-semibold'>{user.username}</div>
          <div className='text-[15px] text-gray-400 font-semibold'>{user.name}</div>
        </div>
        </div>
        
        <FollowButton targetUserId={user._id} tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-[white] rounded-2xl'}/>
    </div>
  )
}

export default OtherUsers
