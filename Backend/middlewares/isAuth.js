import jwt from "jsonwebtoken";

const isAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized. Please login."
            });
        }
        const decoded =await jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: `Invalid or expired token ${error}`
        });
    }
};

export default isAuth;