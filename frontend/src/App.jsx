import React, { useEffect } from 'react'
import {Routes,Route, Navigate} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import GetCurrentUser from './hooks/GetCurrentUser'
import GetSuggestedUser from './hooks/GetSuggestedUser'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import GetAllPost from './hooks/GetAllPost'
import Loops from './pages/Loops'
import GetAllLoops from './hooks/GetAllLoops'
import Story from './pages/Story'
import GetAllStories from './hooks/GellAllStories'
import Messages from './pages/Messages'
import MessageArea from './pages/MessageArea'
export const serverUrl="http://localhost:8000"
import {io} from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import GetFollowingList from './hooks/GetFollowingList'
import GetPrevChatUsers from './hooks/GetPrevChatUsers'
import Search from './pages/Search'
import GetAllNotifications from './hooks/GetAllNotifications'
import Notification from './pages/Notification'
import { setNotificationData } from './redux/userSlice'

const App = () => {
  GetCurrentUser()
  GetSuggestedUser()
  GetAllPost()
  GetAllLoops()
  GetAllStories()
  GetFollowingList()
  GetPrevChatUsers()
  GetAllNotifications()
  const {userData,notificationData}=useSelector(state=>state.user)
  const {socket}=useSelector(state=>state.socket)
  const dispatch=useDispatch()
  useEffect(()=>{
    if(userData){
      const socketIo=io(serverUrl,{
        query:{
          userId:userData._id
        }
      })
      dispatch(setSocket(socketIo))
      
      socketIo.on('getOnlineUsers',(users)=>{
        dispatch(setOnlineUsers(users))
      })

      return ()=> socketIo.close()
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }
  },[userData])
  useEffect(() => {
    if (!socket) return

    const handleNotification = (noti) => {
        dispatch(setNotificationData([...(notificationData || []), noti]))
    }

    socket.on("newNotification", handleNotification)

    return () => {
        socket.off("newNotification", handleNotification)
    }
}, [socket, notificationData, dispatch])
  return (
    <Routes>
        <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
        <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
        <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
        <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>}/>
        <Route path='/profile/:username' element={userData?<Profile/>:
      <Navigate to={"/signin"}/>}/>
      <Route path='/story/:username' element={userData?<Story/>:
      <Navigate to={"/signin"}/>}/>
      <Route path='/upload' element={userData?<Upload/>:
      <Navigate to={"/signin"}/>}/>

      <Route path='/search' element={userData?<Search/>:
      <Navigate to={"/signin"}/>}/>

      <Route path='/notifications' element={userData?<Notification/>:
      <Navigate to={"/signin"}/>}/>

      <Route path='/editprofile' element={userData?<EditProfile/>:
      <Navigate to={"/signin"}/>}/>

      <Route path='/messages' element={userData?<Messages/>:
      <Navigate to={"/signin"}/>}/>
      <Route path='/messageArea' element={userData?<MessageArea/>:
      <Navigate to={"/signin"}/>}/>

      <Route path='/loops' element={userData?<Loops/>:
      <Navigate to={"/signin"}/>}/>
    
    </Routes>
  )
}

export default App
