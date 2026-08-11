import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchData } from '../redux/userSlice'
import dp from '../assets/profile.jpg'

const Search = () => {
    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const { searchData } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleSearch = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/search?keyword=${input}`,
                { withCredentials: true }
            )

            dispatch(setSearchData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleSearch()
    }, [input])

    return (
        <div className='w-full min-h-[100vh] bg-black flex flex-col items-center gap-[15px] pt-[20px]'>

            {/* Back button */}
            <div className='w-full h-[50px] flex items-center px-[30px]'>
                <MdOutlineKeyboardBackspace
                    className='cursor-pointer text-white w-[25px] h-[25px]'
                    onClick={() => navigate("/")}
                />
            </div>

            {/* Search bar */}
            <div className='w-full flex items-center justify-center'>
                <form
                    className='w-[90%] max-w-[800px] h-[55px] rounded-full
                    bg-[#0f1414] flex items-center px-[20px]'
                >
                    <FiSearch className='w-[20px] h-[20px] text-white' />

                    <input
                        type="text"
                        placeholder='search...'
                        className='w-full h-[40px] rounded-full px-[20px]
                        outline-none text-white text-[18px] bg-transparent'
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                    />
                </form>
            </div>

            {/* Search results */}
            <div className='w-full flex flex-col items-center gap-[10px]'>

                {input && searchData?.map((user) => (
                    <div
                        key={user._id}
                        className='w-[90%] max-w-[700px] h-[55px]
                        rounded-full bg-white flex items-center gap-[15px]
                        px-[10px] hover:bg-gray-200 cursor-pointer'
                        onClick={() =>
                            navigate(`/profile/${user.username}`)
                        }
                    >

                        {/* Profile image */}
                        <div className='w-[45px] h-[45px]
                        border-2 border-black rounded-full
                        overflow-hidden shrink-0'>

                            <img
                                src={user.profileImage || dp}
                                alt=""
                                className='w-full h-full object-cover'
                            />

                        </div>

                        {/* User information */}
                        <div className='text-black'>

                            <div className='text-[16px] font-semibold'>
                                {user.username}
                            </div>

                            <div className='text-[13px] text-gray-500'>
                                {user.name}
                            </div>

                        </div>

                    </div>
                ))}

                {!input && <div className='text-[30px] text-gray-700 font-bold'>
                    Search Here...
                </div>}

            </div>

        </div>
    )
}

export default Search