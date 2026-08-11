import User from '../models/User.model.js'
import uploadOnCloudinary from '../config/cloudinary.js'
import Notification from '../models/notification.model.js'
import {getSocketId,io} from '../socket.js'
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).populate("posts loops posts.author posts.comments story following saved")
        if (!user) {
            return res.status(400).json({ message: "user not found!" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `get user Error ${error}` })
    }
}

const suggestedUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: `get suggesteduser Error ${error}` })
    }
}

const editProfile = async (req, res) => {
    try {
        const { name, username, bio, profession, gender } = req.body
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found!" })
        }
        const sameUserWithUserName = await User.findOne({ username }).select("-password")

        if (sameUserWithUserName && sameUserWithUserName._id.toString() !== req.userId) {
            return res.status(400).json({ message: "username already exist" })
        }

        let profileImage;
        if (req.file) {
            profileImage = await uploadOnCloudinary(req.file.path)
        }

        user.name = name
        user.username = username
        if (profileImage) {
            user.profileImage = profileImage
        }

        user.bio = bio
        user.profession = profession
        user.gender = gender

        await user.save()

        return res.status(200).json(user)
    } catch (error) {
        console.log(`edit profile ${error}`)
        return res.status(500).json({ message: `editProfile Error ${error}` })
    }
}

const getProfile = async (req, res) => {
    try {
        const username = req.params.username
        const user = await User.findOne({ username }).select("-password")
            .populate("posts loops followers following saved")
        if (!user) {
            return res.status(400).json({ message: "user not found!" })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `getProfile Error ${error}` })
    }
}

const follow = async (req, res) => {
    try {
        const currentUserId = req.userId
        const targetUserId = req.params.targetUserId

        if (!targetUserId) {
            return res.status(400).json({ message: "Target not found!" })
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You can not follow yourself" })
        }
        const currentUser = await User.findById(currentUserId)
        const targetUser = await User.findById(targetUserId)

        const isFollowing = currentUser?.following?.includes(targetUserId)
        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId)
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId)

            await currentUser.save()

            await targetUser.save()

            return res.status(200).json({ following: false, message: "unfollow successfully" })
        } else {
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId)
            if (currentUser._id !== targetUser._id) {
                const notification = await Notification.create({
                    sender: currentUser._id,
                    receiver: targetUser._id,
                    type: "follow",
                    message: "Followed You"
                })
                const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender receiver")
                const receiverSocketId = getSocketId(targetUser._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
            await currentUser.save()
            await targetUser.save()

            return res.status(200).json({ following: true, message: "follow successfully" })
        }


    } catch (error) {
        return res.status(500).json({ message: `Follow Error ${error}` })
    }
}

const followingList = async (req, res) => {
    try {
        const result = await User.findById(req.userId)
        return res.status(200).json(result?.following)
    } catch (error) {
        return res.status(500).json({ message: `following error ${error}` })
    }
}

const search = async (req, res) => {
    try {
        const keyWord = req.query.keyword

        if (!keyWord) {
            return res.status(400).json({ message: "Keyword is required" })
        }
        const users = await User.find({
            $or: [
                { username: { $regex: keyWord, $options: "i" } },
                { name: { $regex: keyWord, $options: "i" } }
            ]
        }).select("-password")

        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: `Search error ${error}` })
    }
}

const getAllNotification=async(req,res)=>{
    try {
        const notifications=await Notification.find({
            receiver:req.userId
        }).populate("sender receiver post loop").sort({createdAt:-1})
        return res.status(200).json(notifications)
    } catch (error) {
        return res.status(500).json({message:`get notification error ${error}`})
    }
}

const markAsRead=async(req,res)=>{
    try {
        const {notificationId}=req.body
        
        if(Array.isArray(notificationId)){
            await Notification.updateMany(
                {_id:{$in: notificationId},receiver:req.userId},
                {$set:{isRead:true}}
            )
        }else{
            await Notification.findOneAndUpdate(
                {_id:notificationId,receiver:req.userId},
                {$set:{isRead:true}}
            )
        }
        
        return res.status(200).json({message:"Marked as read"})
    } catch (error) {
        return res.status(500).json({message:`read notification error ${error}`})
    }
}

export {markAsRead,getAllNotification,search, followingList, getCurrentUser, suggestedUsers, editProfile, getProfile, follow }