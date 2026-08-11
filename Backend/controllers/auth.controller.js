import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import generateToken from '../config/token.js'
import sendMail from '../config/Mail.js'

const signUp=async(req,res)=>{
    try {
        const {name,username,email,password}=req.body
        const findByEmail= await User.findOne({email})
        if(findByEmail){
            return res.status(400).json({message:"Email already exist !"})
        }
        const findByUsername=await User.findOne({username})
        if(findByUsername){
            return res.status(400).json({message:"username already exist !"})
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters !"})
        }
        const hashedPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            name,
            username,
            email,
            password:hashedPassword
        })

        const token=await generateToken(user._id)

        if (!token) {
        return res.status(500).json({
        message: "Token generation failed",});
        }

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`signUp error ${error}`})
    }
}

const signIn=async(req,res)=>{
    try {
        const {username,password}=req.body

        const user= await User.findOne({username})

        if(!user){
            return res.status(400).json({message:"No user found!"})
        }
        const verifyPassword=await bcrypt.compare(password,user.password)
        if(!verifyPassword){
            return res.status(400).json({message:"wrong password !"})
        }

        const token=await generateToken(user._id)
        

        if (!token) {
        return res.status(500).json({
        message: "Token generation failed",});
        }

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:10*365*24*60*60*1000,
            secure:false,
            sameSite:"Strict"
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`signIn error ${error}`})
    }
}

const signOut=async(req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"LogOut successfully !"}) 
    } catch (error) {
        return res.status(500).json({message:`signOut error ${error}`})
    }
}

const sendOtp=async(req,res)=>{
    try {
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found!"})
        }
        const otp=Math.floor(1000+Math.random()*9000).toString()
        user.resetOtp=otp;
        user.otpExpires= Date.now() + 5*60*60*1000;
        user.isOtpVerified=false
        
        await user.save()

        await sendMail(email,otp)

        return res.status(200).json({message:"email successfully send"})
    } catch (error) {
        return res.status(500).json({message:`sendotp  error ${error}`})
    }
}

const verifyOtp=async(req,res)=>{
    try {
        const {email,otp}=req.body
        const user=await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
            return res.status(400).json({message:"Invalid or expired OTP!"})
        }
        user.isOtpVerified=true
        user.resetOtp=undefined
        user.otpExpires=undefined

        await user.save()
        return res.status(200).json({message:"OTP verified"})
    } catch (error) {
        return res.status(500).json({message:`verifyOtp error ${error}`})
    }
}

const resetPassword=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"Otp verification required!"})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        user.password=hashedPassword
        user.isOtpVerified=false

        await user.save()

        return res.status(200).json({message:"password reset successfully"})
    } catch (error) {
        return res.status(500).json({message:`resetPassword  error ${error}`})
    }
}

export {signUp,signIn,signOut,sendOtp,verifyOtp,resetPassword}