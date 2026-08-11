import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryData } from '../redux/storySlice'
import StoryComp from '../components/StoryComp'

const Story = () => {
    const {username}=useParams()
    const dispatch=useDispatch()
    const {storyData}=useSelector(state=>state.story)
    const handleStory=async()=>{
        dispatch(setStoryData(null))
        try {
            const result=await axios.get(`${serverUrl}/api/story/getStoryByUserName/${username}`,
                {withCredentials:true}
            )
            dispatch(setStoryData(result.data[0]))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        if(username){
            handleStory()
        }
    },[username])
  return (
    <div className='w-full h-[100vh] flex justify-center text-center bg-black'>
      <StoryComp storyData={storyData}/>
    </div>
  )
}

export default Story
