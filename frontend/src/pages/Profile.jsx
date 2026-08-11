import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import profile from '../assets/profile.jpg'
import Navbar from '../components/Navbar'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import { setSelectedUser } from '../redux/messageSlice'
const Profile = () => {
    const { username } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const [postType, setPostType] = useState("posts")
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
    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${username}`,
                { withCredentials: true }
            )
            dispatch(setProfileData(result.data))

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        handleProfile()
    }, [username, dispatch])

    return (
        <div className='w-full min-h-screen bg-black'>
            <div className='w-full h-[80px] flex justify-between
        items-center px-[30px] text-white'>
                <div onClick={() => navigate("/")}><MdOutlineKeyboardBackspace className='cursor-pointer text-white w-[25px] h-[25px]' /></div>
                <div className='font-semibold text-[20px]'>{profileData?.username}</div>
                <div onClick={handleLogOut} className='font-semibold text-[20px] cursor-pointer text-blue-500'>LogOut</div>
            </div>

            <div className='w-full h-[150px] flex items-start gap-[20px]
        lg:gap-[50px] pt-[20px] px-[10px] justify-center'>
                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black
                rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || profile} alt="" className='w-full object-cover' />
                </div>
                <div >
                    <div className='text-white font-semibold text-[22px]'>{profileData?.name}</div>
                    <div className='text-[#ffffffc7] font-semibold text-[17px]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[#ffffffc7] font-semibold text-[17px]'>{profileData?.bio}</div>
                </div>
            </div>

            <div className='w-full h-[100px] flex items-center justify-center gap-[40px]
        md:gap-[60px] px-[20%] pt-[30px]'>
                <div>
                    <div className='text-white text-[22px] md:tex-[30px] font-semibold'>{profileData?.posts.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffc7]'>Posts</div>
                </div>
                <div>

                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (
                                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer 
                                overflow-hidden ${index !== 0 ? "-ml-8" : ""}`}>
                                    <img src={user?.profileImage || profile} alt="" className='w-full object-cover' />
                                </div>
                            ))}
                        </div>

                        <div className='text-white text-[22px] md:tex-[30px] font-semibold'>
                            {profileData?.followers?.length}
                        </div>
                    </div>

                    <div className='text-[#ffffffc7] text-[18px] md:text-[22px] '>Followers</div>
                </div>
                <div>

                    <div className='flex items-center justify-center gap-[20px]'>
                        <div className='flex relative'>

                            {profileData?.following?.slice(0, 3).map((user, index) => (
                                <div className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden
                            ${index !== 0 ? "-ml-8" : ""}`}>
                                    <img src={user?.profileImage || profile} alt="" className='w-full object-cover' />
                                </div>
                            ))}

                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following?.length}
                        </div>
                    </div>

                    <div className='text-[#ffffffc7] text-[18px] md:tex-[22px] '>Following</div>
                </div>
            </div>

            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>
                {profileData?._id === userData?._id &&
                    <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white]
                cursor-pointer rounded-2xl' onClick={() => navigate('/editprofile')}>Edit Profile</button>}
                {profileData?._id !== userData?._id &&
                    <>
                        <FollowButton onFollowChange={handleProfile} targetUserId={profileData?._id} tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] cursor-pointer rounded-2xl'} />

                        <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white]
                cursor-pointer rounded-2xl' onClick={() => {
                                dispatch(setSelectedUser(profileData))
                                navigate("/messageArea")
                            }}>Message</button>
                    </>}
            </div>

            <div className='w-full min-h-[100vh] flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[100px]'>


                    {profileData?._id === userData._id && <div className='w-[90%] max-w-[500px] h-[80px] bg-[white] rounded-full
            flex justify-center items-center gap-[10px]' >

                        <div className={`${postType === "posts" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center 
                text-[19px] font-semibold hover:bg-black rounded-full hover:text-white
                cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("posts")}>Posts</div>

                        <div className={`${postType === "saved" ? "bg-black shadow-2xl shadow-black text-white" : ""} w-[28%] h-[80%] flex justify-center items-center 
                text-[19px] font-semibold hover:bg-black rounded-full hover:text-white
                cursor-pointer hover:shadow-2xl hover:shadow-black`} onClick={() => setPostType("saved")}>Saved</div>



                    </div>}



                    <Navbar />


                    {profileData?._id === userData._id && <>

                        {postType === "posts" && postData.map((post, index) => (
                            post.author?._id === profileData?._id && <Post key={index} post={post} />
                        ))}


                        {postType === "saved" &&
                            postData.map((post) => (
                                userData?.saved?.some(
                                    savedPost =>
                                        savedPost?._id?.toString() === post?._id?.toString()
                                ) && <Post key={post._id} post={post} />
                            ))
                        }
                    </>
                    }

                    {profileData?._id !== userData._id &&

                        postData.map((post, index) => (
                            post.author?._id === profileData?._id && <Post key={index} post={post} />
                        ))
                    }


                </div>
            </div>
        </div>
    )
}

export default Profile


