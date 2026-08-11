import React, { useEffect, useState } from 'react'
import profile from '../assets/profile.jpg'
import { useSelector } from 'react-redux'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import { FaEye } from 'react-icons/fa'
const StoryComp = ({ storyData }) => {

  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [showViewers, setShowViewers] = useState(false);
  const { userData } = useSelector(state => state.user)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      navigate("/");
    }
  }, [progress, navigate]);
  return (
    <div className='w-full max-w-[500px] h-[100vh] border-x-2
    border-gray-800 pt-[10px] relative flex flex-col
    justify-center'>

      <div className='flex items-center gap-[10px] absolute top-[20px] px-[10px]'>
        <MdOutlineKeyboardBackspace className='cursor-pointer text-white w-[25px] h-[25px]'
          onClick={() => navigate('/')} />
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-gray-300
        ">
          <img
            src={storyData?.author?.profileImage || profile}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className='w-[120px]'>
          <h2 className="font-semibold text-white font-semibold text-lg">
            @{storyData?.author?.username}
          </h2>
        </div>

      </div>
      <div className='absolute top-[10px] bottom-0 left-0 w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear'
          style={{ width: `${progress}%` }}>

        </div>
      </div>
      {!showViewers && <>
        <div className="w-full  bg-white flex justify-center items-center mt-[50px]">
          {storyData?.mediaType === "image" && (
            <img
              src={storyData.media}
              alt=""
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}

          {storyData?.mediaType === "video" && (
            <div className="w-full max-h-[85vh]">
              <VideoPlayer media={storyData.media} />
            </div>
          )}
        </div>

        {storyData?.author?.username === userData?.username &&
          <div className='w-full cursor-pointer flex items-center gap-[20px] h-[70px] p-2 left-0 absolute bottom-0'
          onClick={()=>setShowViewers(true)}>
            <div className='text-white flex items-center gap-[5px]'>
              <FaEye />
              {storyData?.viewers?.length}</div>
            <div className='flex relative'>

              {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden
                                      ${index !== 0 ? "-ml-8" : ""}`}>
                  <img src={viewer?.profileImage || profile} alt="" className='w-full object-cover' />
                </div>
              ))}

            </div>

          </div>} </>}

      {showViewers && <>
        <div className="w-full cursor-pointer  bg-white flex justify-center items-center mt-[100px]"
        onClick={()=>setShowViewers(false)}>
          {storyData?.mediaType === "image" && (
            <img
              src={storyData.media}
              alt=""
              className="w-full h-auto max-h-[40vh] object-contain"
            />
          )}

          {storyData?.mediaType === "video" && (
            <div className="w-full max-h-[85vh]">
              <VideoPlayer media={storyData.media} />
            </div>
          )}
        </div>
        <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]'>
            <div className='text-white flex items-center gap-[10px]'>
              <FaEye/>
              <span>{storyData?.viewers?.length}</span>
              <span>Viewers</span>
            </div>
            <div className='w-full flex flex-col max-h-full gap-[10px]
      overflow-auto pt-[20px]'>
        {storyData?.viewers?.map((viewer,index)=>(
          <div className='w-full flex items-center gap-[20px]'>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-gray-300
        ">
          <img
            src={viewer?.profileImage || profile}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className='w-[120px]'>
          <h2 className="font-semibold text-white font-semibold text-lg">
            @{viewer?.username}
          </h2>
        </div>
          </div>
        ))}
      </div>
        </div>
      </>}
      
    </div>
  )
}

export default StoryComp
