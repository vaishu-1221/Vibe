import express from 'express'
import { signIn,signUp,signOut, sendOtp, verifyOtp, resetPassword } from '../controllers/auth.controller.js';

const authRouter=express.Router();

authRouter.post("/signup",signUp)
authRouter.post("/signin",signIn)
authRouter.post("/sendOtp",sendOtp)
authRouter.post("/verifyOtp",verifyOtp)
authRouter.post("/resetPassword",resetPassword)
authRouter.get("/signout",signOut)



export default authRouter