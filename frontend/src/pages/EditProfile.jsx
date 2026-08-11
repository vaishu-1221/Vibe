import React, { useRef, useState } from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import profile from '../assets/profile.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { setProfileData, setUserData } from '../redux/userSlice'
import { ClipLoader } from 'react-spinners'
const EditProfile = () => {
  const navigate = useNavigate()
  const { userData, profileData } = useSelector(state => state.user)
  const imageInput = useRef()
  const [frontendImage, setFrontendImage] = useState(userData.profileImage || profile)
  const [backendImage, setBackendImage] = useState(null)
  const [name, setName] = useState(userData.name || "");
  const [username, setUsername] = useState(userData.username || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [gender, setGender] = useState(userData.gender || "");
  const dispatch=useDispatch()
  const [loading,setLoading]=useState(false)
  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleEditProfile = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("profession", profession);
      formData.append("gender", gender.toLowerCase());
      if(backendImage){
        formData.append("profileImage",backendImage)
      }
      const result = await axios.post(`${serverUrl}/api/user/editProfile`,formData,{withCredentials:true})
      dispatch(setProfileData(result.data))
      dispatch(setUserData(result.data))
      setLoading(false)
      navigate(`/profile/${userData.username}`)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div className='w-full min-h-[100vh] bg-black flex
    items-center flex-col gap-[20px] '>
      <div
        className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'><MdOutlineKeyboardBackspace className='cursor-pointer text-white w-[25px] h-[25px]'
          onClick={() => navigate(`/profile/${userData.username}`)} />
        <h1 className='text-white text-[20px]  font-semibold'>Edit Profile</h1>

      </div>

      <div className='w-[100px] h-[100px] md:w-[140px] md:h-[140px] border-2 border-black
          rounded-full cursor-pointer overflow-hidden ' onClick={() => imageInput.current.click()}>
        <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage} />
        <img src={frontendImage} alt="" className='w-full object-cover' />
      </div>

      <div className='text-blue-500 text-center text-[18px] font-semibold cursor-pointer' onClick={() => imageInput.current.click()}>Change Your Profile Picture</div>
      <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
      border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your name' onChange={(e) => setName(e.target.value)} value={name} />

      <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
      border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your username' onChange={(e) => setUsername(e.target.value)} value={username} />

      <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
      border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Profession' onChange={(e) => setProfession(e.target.value)} value={profession} />

      <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
      border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Bio' onChange={(e) => setBio(e.target.value)} value={bio} />

      <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
      border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Gender' onChange={(e) => setGender(e.target.value)} value={gender} />

      <button onClick={handleEditProfile} className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[white]
                cursor-pointer rounded-2xl'>{loading?<ClipLoader size={30} color='black'/>:"Save Profile"}</button>

    </div>
  )
}

export default EditProfile
