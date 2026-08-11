import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { editProfile, getCurrentUser, getProfile, suggestedUsers } from '../controllers/user.controller.js'
import {upload} from '../middlewares/multer.js'
import { comments, getAllPosts, like, saved, uploadPost } from '../controllers/post.controller.js'

const postRouter=express.Router()

postRouter.post('/upload',isAuth,upload.single("media"),uploadPost)
postRouter.get('/getAll',isAuth,getAllPosts)
postRouter.get('/like/:postId',isAuth,like)
postRouter.get('/saved/:postId',isAuth,saved)
postRouter.post('/comment/:postId',isAuth,comments)

export default postRouter