import { ApiError } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

// for following in : (req,res,next) ,we are not using " res " so put it " _ ", which you will often watch in production level application...
export const  verifyJWT = asyncHandler(async (req, _, next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Acess Token")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})