import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from '../models/Post.model.js'
import User from "../models/User.model.js";
import { getSocketId, io } from "../socket.js";

const uploadPost=async(req,res)=>{
    try {
        const {caption,mediaType}=req.body
        let media;
        if(req.file){
            media=await uploadOnCloudinary(req.file.path)
        }else{
            return res.status(400).json({message:"Media is required!"})
        }
        const post =await Post.create({
            caption,media,mediaType,author:req.userId
        })
        const user=await User.findById(req.userId)
        await user.posts.push(post._id)
        await user.save()
        const populatedPost=await Post.findById(post._id).populate("author","name username profileImage")
        return res.status(200).json(populatedPost)
    } catch (error) {
        return res.status(500).json({message:`uploadPost error ${error}`})
    }
}

const getAllPosts=async(req,res)=>{
    try {
        const posts=await Post.find({}).populate("author","name username profileImage")
        .populate("comments.author","name username profileImage").sort({created:-1})
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({message:`getAllPost error ${error}`})
    }
}

const like=async(req,res)=>{
    try {
        const postId=req.params.postId
        const post=await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found!"})
        }
        const alreadyLiked=post.likes.some(id=>id.toString()===req.userId.toString())
        
        if(alreadyLiked){
            post.likes=post.likes.filter(id=>id.toString()!==req.userId.toString())
        }else{
            post.likes.push(req.userId)
            if(post.author._id!==req.userId){
                const notification=await Notification.create({
                    sender:req.userId,
                    receiver:post.author._id,
                    type:"like",
                    post:post._id,
                    message:"liked your post"
                })
                const populatedNotification=await Notification.findById(notification._id)
                .populate("sender receiver post")
                const receiverSocketId=getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        }
        
    

        await post.save()
        await post.populate("author","name username profileImage")

        io.emit("likedPost",{postId:post._id,likes:post.likes})
        
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:`likePost error ${error}`})
    }
}

const comments=async(req,res)=>{
    try {
        const {message}=req.body
        const postId=req.params.postId
        const post=await Post.findById(postId)
        if(!post){
            return res.status(400).json({message:"Post not found!"})
        }
        post.comments.push({
            author:req.userId,
            message
        })
        if(post.author._id!==req.userId){
                const notification=await Notification.create({
                    sender:req.userId,
                    receiver:post.author._id,
                    type:"comment",
                    post:post._id,
                    message:"Commented on your post"
                })
                const populatedNotification=await Notification.findById(notification._id)
                .populate("sender receiver post")
                const receiverSocketId=getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification",populatedNotification)
                }
            }
        await post.save()
        await post.populate("author","name username profileImage")
        await post.populate("comments.author")

        io.emit("commentedPost",{postId:post._id,comments:post.comments})
        
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({message:`commentPost error ${error}`})
    }
}

const saved=async(req,res)=>{
    try {
        const postId=req.params.postId
        
        const user=await User.findById(req.userId)
        const post=await Post.findById(postId)
        const alreadySaved=user.saved.some(id=>id.toString()===postId)
        if (!user) { return res.status(404).json({ message: "User not found" }) } 
        if (!post) { return res.status(404).json({ message: "Post not found" }) }
        if(alreadySaved){
            user.saved=user.saved.filter(id=>id.toString()!==postId.toString())
        }else{
            user.saved.push(postId)
        }
        await user.save()
        await user.populate("saved")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`savedPost error ${error}`})
    }
}
export {uploadPost,getAllPosts,like,comments,saved}