import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT= asyncHandler( async(req, res, next)=> {
    try {
        let accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken) {
            throw new ApiError(401, "Unauthorized Request");
        }

        const decodedToken= jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user) {
            throw new ApiError(500, "Invalid Access Token")
        }

        req.user= user;
        next();
    } catch (error) {
        throw new ApiError(500, error.message || "Internal Server Error");
    }
})