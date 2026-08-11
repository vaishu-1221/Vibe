import React from 'react'
import white_logo from '../assets/white_logo.png'
import { FaRegHeart } from 'react-icons/fa'
import StoryCard from './StoryCard'
import Navbar from './Navbar'
import { BiMessageAltDetail } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import Post from './Post'
import { useNavigate } from 'react-router-dom'
const Feed = () => {
  const { postData } = useSelector(state => state.post)
  const { userData, notificationData } = useSelector(state => state.user)
  const { storyList, currentUserStory } = useSelector(state => state.story)
  const navigate = useNavigate()
  return (
    <div className='lg:w-[50%] w-full bg-black min-h-[100vh]
    lg:h-[100vh] relative lg:overflow-y-auto'>

      <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
        <img src={white_logo} alt="" className='w-[80px]' />
        <div className='flex items-center gap-[10px]'>
          <div className='relative cursor-pointer'
          onClick={()=>navigate('/notifications')}>
            <FaRegHeart className='text-white w-[25px] h-[25px]' />
            {notificationData?.length>0 && notificationData.some((noti) => noti.isRead === false) && (<div
            className='w-[10px] h-[10px] bg-blue-600 rounded-full
          absolute top-0 right-[-5px]'></div>)
          }
          </div>
          <BiMessageAltDetail className='text-white w-[25px] h-[25px] cursor-pointer'
            onClick={() => navigate("/messages")} />
        </div>
      </div>

      <div className='flex w-full overflow-auto gap-[20px] items-center p-[20px]'>
        <StoryCard username={"You"} profileImage={userData?.profileImage} story={userData.story} />

        {
          storyList?.map((story, index) => (
            <StoryCard username={story?.author?.username} profileImage={story?.author?.profileImage}
              story={story} key={index} />
          ))
        }
      </div>

      <div className='w-full min-h-[100vh] flex flex-col items-center
          gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]'>
        <Navbar />
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  )
}

export default Feed
