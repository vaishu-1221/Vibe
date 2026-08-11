import React from 'react'
import profile from '../assets/profile.jpg'
const NotificationCard = ({ notification }) => {
    
    return (
        <div className='w-full flex justify-between items-center
        min-h-[50px] bg-gray-800 rounded-full p-[5px]'>
            <div className='flex gap-[10px] items-center'>
                <div className='w-[40px] h-[40px] border-2 border-black
                        rounded-full cursor-pointer overflow-hidden' >
                    <img src={notification?.sender?.profileImage || profile} alt="" className='w-full object-cover' />
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-[16px] text-white 
                    font-semibold'>{notification?.sender?.username}</h1>
                    <div className='text-[15px] text-gray-200'>{notification?.message}</div>
                </div>
            </div>
            <div className='w-[40px] h-[40px] rounded-full overflow-hidden border-4 border-black'>

                { notification?.loop ?
                <video src={notification?.loop?.media} muted loop className='h-full object-cover' />
                :
                notification?.post?.mediaType == "image" ? 
                <img src={notification?.post?.media} className='h-full object-cover'/> 
                :
                notification?.post?
                <video src={notification?.post?.media} muted loop className='h-full object-cover' />
                :
                <img src={notification?.receiver?.profileImage || profile} className='h-full object-cover'/> 
                }

            </div>
        </div>
    )
}

export default NotificationCard
