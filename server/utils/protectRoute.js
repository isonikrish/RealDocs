import User from "../models/user.js";
import jwt from 'jsonwebtoken'
export async function protectRoute(req,res,next){
    try {
        const token = req.cookies.user;
        if(!token) return res.status(401).json({msg:"Unauthorized or no token provided"});
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({msg:"Unauthorized or Invalid token"});

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({msg: "User not found"});
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
        console.log(error.message);
    }
}

