import React, { useState } from 'react'
import white_logo from '../assets/white_logo.png'
import { FaRegHeart } from "react-icons/fa";
import profile from '../assets/profile.jpg'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import OtherUsers from './OtherUsers';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import Notification from '../pages/Notification';

const LeftHome = () => {
  const { userData, suggestedUsers, notificationData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showNotification, setShowNotification] = useState(false)
  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`,
        { withCredentials: true }
      )
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={`w-[25%] hidden lg:block h-[100vh] bg-black
    border-r-2 border-gray-900${showNotification? "overflow-hidden":"overflow-auto"}`}>

      <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
        <img src={white_logo} alt="" className='w-[80px]' />
        <div className='relative cursor-pointer z-[100]'
          onClick={() =>setShowNotification(prev=>!prev)}>
          <FaRegHeart className='text-white w-[25px] h-[25px]' />
          {notificationData?.length>0 && notificationData.some((noti) => noti.isRead === false) && (<div
            className='w-[10px] h-[10px] bg-blue-600 rounded-full
          absolute top-0 right-[-5px]'></div>)
          }
        </div>

      </div>



      {!showNotification && <>
        <div className='flex items-center justify-between w-full gap-[10px] px-[10px] border-b-2 border-gray-900 py-[10px]'>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] border-2 border-black
        rounded-full cursor-pointer overflow-hidden'>
              <img src={userData.profileImage || profile} alt="" className='w-full object-cover' />
            </div>
            <div>
              <div className='text-[18px] text-white font-semibold'>{userData.username}</div>
              <div className='text-[15px] text-gray-400 font-semibold'>{userData.name}</div>
            </div>
          </div>
          <div onClick={handleLogOut} className='text-blue-500 font-semibold cursor-pointer'>
            Logout
          </div>
        </div>

        <div className='w-full fles fles-col gap-[20px] p-[20px]'>
          <h1 className='text-white text-[19px]'>Suggested Users</h1>
          {suggestedUsers && suggestedUsers.slice(0, 3).map((user, index) => (
            <OtherUsers key={index} user={user} />
          ))}
        </div>


      </>}

      {showNotification && <Notification/>}



    </div>
  )
}

export default LeftHome
