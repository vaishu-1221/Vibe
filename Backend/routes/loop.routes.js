import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import {upload} from '../middlewares/multer.js'
import { comments, getAllLoops, like, uploadLoop } from '../controllers/loop.controller.js'



const loopRouter=express.Router()

loopRouter.post('/upload',isAuth,upload.single("media"),uploadLoop)
loopRouter.get('/like/:loopId',isAuth,like)
loopRouter.post('/comment/:loopId',isAuth,comments)
loopRouter.get('/getAll',isAuth,getAllLoops)

export default loopRouter