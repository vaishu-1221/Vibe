import jwt from 'jsonwebtoken'
const generateToken=async(userId)=>{
    try {
        const token=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"10y"})
        return token
    } catch (error) {
        console.log(`gen token error ${error}`)
        return null
    }
}

export default generateToken