import React, { useEffect, useState } from 'react'

import profile from '../assets/profile.jpg'

import VideoPlayer from './VideoPlayer'

import { useDispatch, useSelector } from 'react-redux'

import { GoBookmarkFill, GoHeart, GoHeartFill } from 'react-icons/go'

import { MdOutlineBookmarkBorder, MdOutlineComment } from 'react-icons/md'

import { IoSendSharp } from 'react-icons/io5'

import axios from 'axios'

import { serverUrl } from '../App'

import { setPostData } from '../redux/postSlice'

import { setUserData } from '../redux/userSlice'

import FollowButton from './FollowButton'

import { useNavigate } from 'react-router-dom'


const Post = ({ post }) => {

    const { userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const { socket } = useSelector(state => state.socket)

    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const handleLike = async () => {
        try {

            const result = await axios.get(
                `${serverUrl}/api/post/like/${post._id}`,
                { withCredentials: true }
            )

            const updatedPost = result.data

            const updatedPosts = postData.map(p =>
                p._id === post._id ? updatedPost : p
            )

            dispatch(setPostData(updatedPosts))

        } catch (error) {
            console.log(error)
        }
    }


    const handleComment = async () => {
        try {

            if (!message.trim()) return

            const result = await axios.post(
                `${serverUrl}/api/post/comment/${post._id}`,
                { message },
                { withCredentials: true }
            )

            const updatedPost = result.data

            const updatedPosts = postData.map(p =>
                p._id === post._id ? updatedPost : p
            )

            dispatch(setPostData(updatedPosts))

            setMessage("")

        } catch (error) {
            console.log(error)
        }
    }


    const handleSaved = async () => {
        try {

            const result = await axios.get(
                `${serverUrl}/api/post/saved/${post._id}`,
                { withCredentials: true }
            )
            
            dispatch(setUserData(result.data))
        
        } catch (error) {
            console.log(error.response)
        }
    }


    const isSaved = userData?.saved?.some((savedPost) => {
    return savedPost?._id?.toString() === post?._id?.toString()
})


    useEffect(() => {

        socket?.on("likedPost", (updatedData) => {

            const updatedPosts = postData.map(p =>
                p._id === updatedData.postId
                    ? { ...p, likes: updatedData.likes }
                    : p
            )

            dispatch(setPostData(updatedPosts))
        })


        socket?.on("commentedPost", (updatedData) => {

            const updatedPosts = postData.map(p =>
                p._id === updatedData.postId
                    ? { ...p, comments: updatedData.comments }
                    : p
            )

            dispatch(setPostData(updatedPosts))
        })


        return () => {
            socket?.off("likedPost")
            socket?.off("commentedPost")
        }

    }, [socket, postData, dispatch])


    return (

        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">

            {/* Header */}

            <div className="flex items-center justify-between px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-gray-300">

                        <img
                            src={post.author?.profileImage || profile}
                            alt=""
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() =>
                                navigate(`/profile/${post?.author?.username}`)
                            }
                        />

                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900 text-lg">
                            @{post.author.username}
                        </h2>
                    </div>

                </div>


                {userData?._id !== post.author?._id && (

                    <FollowButton
                        targetUserId={post.author?._id}
                        tailwind={
                            "px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                        }
                    />

                )}

            </div>


            {/* Media */}

            <div className="w-full bg-white flex justify-center items-center">

                {post.mediaType === "image" && (

                    <img
                        src={post.media}
                        alt=""
                        className="w-full h-auto max-h-[85vh] object-contain"
                    />

                )}


                {post.mediaType === "video" && (

                    <div className="w-full max-h-[85vh]">

                        <VideoPlayer media={post.media} />

                    </div>

                )}

            </div>


            {/* Actions */}

            <div className="flex justify-between items-center px-6 py-4">

                <div className="flex items-center gap-8">

                    <div className="flex items-center gap-2">

                        {!post.likes.includes(userData?._id) ? (

                            <GoHeart
                                onClick={handleLike}
                                className="w-7 h-7 cursor-pointer hover:scale-110 transition"
                            />

                        ) : (

                            <GoHeartFill
                                onClick={handleLike}
                                className="w-7 h-7 cursor-pointer text-red-500 hover:scale-110 transition"
                            />

                        )}

                        <span className="font-medium">
                            {post.likes.length}
                        </span>

                    </div>


                    <div className="flex items-center gap-2">

                        <MdOutlineComment
                            onClick={() => setShowComment(!showComment)}
                            className="w-7 h-7 cursor-pointer hover:scale-110 transition"
                        />

                        <span className="font-medium">
                            {post.comments.length}
                        </span>

                    </div>

                </div>


                <div onClick={handleSaved}>

                    {isSaved ? (

                        <GoBookmarkFill
                            className="w-7 h-7 cursor-pointer hover:scale-110 transition"
                        />

                    ) : (

                        <MdOutlineBookmarkBorder
                            className="w-7 h-7 cursor-pointer hover:scale-110 transition"
                        />

                    )}

                </div>

            </div>


            {/* Caption */}

            {post.caption && (

                <div className="px-6 pb-5">

                    <p className="text-[15px] leading-6">

                        <span className="font-semibold mr-2">
                            @{post.author.username}
                        </span>

                        {post.caption}

                    </p>

                </div>

            )}


            {/* Comment */}

            {showComment && (

                <div className="border-t border-gray-100">

                    <div className="flex items-center gap-3 px-5 py-4 relative">

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
                            className="flex-1 border border-gray-300 rounded-full px-5 py-3 outline-none focus:border-black transition"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleComment()
                                }
                            }}
                        />


                        <button
                            onClick={handleComment}
                            className="absolute right-9 text-black hover:text-blue-600 transition"
                        >
                            <IoSendSharp className="w-6 h-6" />
                        </button>

                    </div>


                    <div className="max-h-[300px] overflow-y-auto">

                        {post.comments.map((com, index) => (

                            <div
                                key={index}
                                className="flex items-start gap-3 px-5 py-4 border-t border-gray-100"
                            >

                                <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-300 flex-shrink-0">

                                    <img
                                        src={com.author?.profileImage || profile}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />

                                </div>


                                <div className="bg-gray-100 rounded-2xl px-4 py-3">

                                    <p className="font-semibold text-sm">
                                        @{com.author?.username}
                                    </p>

                                    <p className="text-gray-700 text-sm">
                                        {com.message}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    )
}


export default Post

