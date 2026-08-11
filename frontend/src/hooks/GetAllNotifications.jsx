import React, { useEffect } from 'react'
import { setNotificationData } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'

function GetAllNotifications() {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    const fetchNotifications = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/user/getAllNotifications`,
                { withCredentials: true }
            )
            dispatch(setNotificationData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchNotifications()
        }
    }, [userData])
}

export default GetAllNotifications