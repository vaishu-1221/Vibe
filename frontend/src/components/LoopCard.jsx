import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2 } from 'react-icons/fi'
import { FiVolumeX } from 'react-icons/fi'
import profile from '../assets/profile.jpg'
import FollowButton from './FollowButton'
import { GoBookmarkFill, GoHeart, GoHeartFill } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineComment } from 'react-icons/md'
import { setLoopData } from '../redux/loopSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import { IoSendSharp } from 'react-icons/io5'

const LoopCard = ({ loop }) => {
  const videoRef = useRef()
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMute, setIsMute] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false)
  const [message,setMessage]=useState("")

  const { userData } = useSelector(state => state.user)
  const { loopData } = useSelector(state => state.loop)
  const { socket } = useSelector(state => state.socket)
  const dispatch = useDispatch()

  const commentRef = useRef()

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video) {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
  }

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleLike = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/loop/like/${loop._id}`,
        { withCredentials: true }
      )

      const updatedLoop = result.data
      const updatedLoops = loopData.map(p => p._id === loop._id ? updatedLoop : p)
      dispatch(setLoopData(updatedLoops))
    } catch (error) {
      console.log(error)
    }
  }

  const handleLikeOnDoubleClick = async () => {
    setShowHeart(true)
    setTimeout(() => setShowHeart(false), 6000)
    { !loop.likes?.includes(userData._id) ? handleLike() : null }
  }

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`, { message },
        { withCredentials: true }
      )

      const updatedLoop = result.data
      const updatedLoops = loopData.map(p => p._id === loop._id ? updatedLoop : p)
      dispatch(setLoopData(updatedLoops))
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false)
      }
    }
    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showComment])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (!video) return;
      if (entry.isIntersecting) {
        video.play()
      } else {
        video.pause()
      }

    }, { threshold: 0.6 })
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  useEffect(()=>{
      socket?.on("likedLoop",(updatedData)=>{
          const updatedLoops = loopData.map(p => p._id === updatedData.loopId 
            ? {...p,likes:updatedData.likes} : p)
          dispatch(setLoopData(updatedLoops))
      })
      socket?.on("commentedLoop",(updatedData)=>{
        const updatedLoops = loopData.map(p => p._id === updatedData.loopId ? 
          {...p,comments:updatedData.comments} : p)
          dispatch(setLoopData(updatedLoops))
      })
  
      return ()=>{
        socket?.off("likedPost")
        socket?.off("commentedPost")
      }
    },[socket,loopData,dispatch])
  return (
    <div className='w-full lg:w-[480px] h-[100vh] flex items-center
    justify-center border-l-2 border-r-2
    border-gray-800 relative overflow-hidden '>

      {showHeart && <div className='absolute top-1/2 left-1/2 transform-translate-x-1/2
      -translate-y-1/2 heart-animation z-50'>
        <GoHeartFill className='w-[100px] h-[100px] text-white drop-shadow-2xl' />
      </div>}

      <div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px]
      rounded-t-4xl bg-[#0e1718] left-0 shadow-2xl shadow-black transition-transform
      duration-500 ease-in-out ${showComment ? "translate-y-0" :
          "translate-y-[100%]"}`}>
        <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>
        
        <div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>
            
            {loop.comments.length===0 && <div className='text-white text-center text-[20px] font-semibold mt-[50px] '>No Comments Yet...</div>}
            
            {loop.comments.map((com,index)=>(
              <div className='w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px]'>
                <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">
                                  <img
                                    src={com.author?.profileImage || profile}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                
                                <div className=" text-white rounded-2xl px-4 py-3">
                                  <p className="font-semibold text-sm">
                                    @{com.author?.username}
                                  </p>
                                  <p className="text-white text-sm">
                                    {com.message}
                                  </p>
                                </div>
              </div>
            ))}
            
        </div>
        
        <div className="flex fixed bottom-0 items-center gap-3 px-5 py-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
            <img
              src={userData?.profileImage || profile}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full sm:max-w-sm lg:max-w-[300px] text-white border border-gray-300 rounded-full px-5 py-3 outline-none focus:border-black transition"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {message && <button
            onClick={handleComment}
            className="absolute text-white right-9 text-black hover:text-blue-600 transition"
          >
            <IoSendSharp className="w-6 h-6" />
          </button>}
        </div>
      </div>

      <video onDoubleClick={handleLikeOnDoubleClick}
        ref={videoRef} src={loop?.media}
        className='w-full max-h-full' autoPlay loop muted={isMute}
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate} />

      <div className='absolute top-[20px] z-[100] right-[20px]'
        onClick={() => setIsMute(prev => !prev)}>

        {!isMute ? <FiVolume2 className='w-[20px] h-[20px] text-white
              font-semibold'/> : <FiVolumeX className='w-[20px] h-[20px]
            text-white font-semibold'/>}

      </div>

      <div className='absolute bottom-0 left-0 w-full h-[3px] bg-gray-900'>
        <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear'
          style={{ width: `${progress}%` }}>

        </div>
      </div>

      <div className='w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col'>
        <div className="flex items-center gap-[10px]">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-gray-300">
            <img
              src={loop.author?.profileImage || profile}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className='w-[120px]'>
            <h2 className="font-semibold text-white font-semibold text-lg">
              @{loop.author.username}
            </h2>
          </div>

          <FollowButton targetUserId={loop?.author?._id}
            tailwind={"w-[100px] px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"} />
        </div>

        <div className='text-white py-[10px]'>
          {loop?.caption}
        </div>

        <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[200px]
        justify-center px-[10px] '>
          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={handleLike}>
              {!loop.likes.includes(userData._id) ? (
                <GoHeart

                  className="w-7 h-7 cursor-pointer hover:scale-110 transition"
                />
              ) : (
                <GoHeartFill

                  className="w-7 h-7 cursor-pointer text-red-500 hover:scale-110 transition"
                />
              )}
            </div>
            <div className='cursor-pointer'>{loop?.likes?.length}</div>
          </div>
          <div className='flex flex-col items-center cursor-pointer'
            onClick={() => setShowComment(true)}>

            <div><MdOutlineComment

              className="w-7 h-7 cursor-pointer hover:scale-110 transition"
            /></div>
            <div className="font-medium">{loop?.comments?.length}</div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default LoopCard
