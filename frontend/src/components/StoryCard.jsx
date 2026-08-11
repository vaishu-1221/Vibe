import React, { useEffect, useState } from 'react'
import profile from '../assets/profile.jpg'
import { FiPlusCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
const StoryCard = ({ profileImage, username, story }) => {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { storyData, storyList } = useSelector(state => state.story)
    const [viewed, setViewed] = useState(false)

    useEffect(() => {
        if (story?.viewers?.some((viewer) =>
            viewer?._id?.toString() === userData?._id?.toString() || viewer===userData?._id?.toString())
        ) {
            setViewed(true)
        } else {
            setViewed(false)
        }
    }, [story, userData, storyData, storyList])

    const handleViewer = async () => {
        const storyId = typeof story === "object"
            ? story?._id
            : story;



        if (!storyId) return;

        try {
            await axios.get(
                `${serverUrl}/api/story/view/${storyId}`,
                { withCredentials: true }
            );
        } catch (error) {
            console.log(error.response?.data || error);
        }
    };
    const handleClick = () => {
        if (!story && username == "You") {
            navigate("/upload")
        } else if (story && username == "You") {
            handleViewer()
            navigate(`/story/${userData.username}`)

        } else {
            handleViewer()
            navigate(`/story/${username}`)
        }
    }
    return (
        <div className='flex flex-col w-[80px]' onClick={handleClick}>
            <div className={`w-[80px] h-[80px] ${!story ? null : !viewed ? 
            "bg-gradient-to-r from-blue-500 to-blue-950" :"bg-gradient-to-b from-gray-500 to-black-950"} rounded-full flex items-center justify-center relative`}>
                <div className='w-[70px] h-[70px] border-2 border-black
            rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileImage || profile} alt="" className='w-full object-cover' />
                    {!story && username == "You" && <div>
                        <FiPlusCircle className='text-black bg-white w-[22px] h-[22px] 
                rounded-full absolute bottom-[10px] right-[10px]' onClick={() => navigate("/upload")} />
                    </div>}
                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>
                {username}
            </div>
        </div>
    )
}

export default StoryCard
