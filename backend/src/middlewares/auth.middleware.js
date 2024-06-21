import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT= async (req, res, next)=> {
    // try {

        let accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");  

        // console.log(req);

        if(!accessToken) {
            new ApiError(500, "Internal Server Error");
        }

        const decodedToken= jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user) {
            throw new ApiError(500, "Invalid Acess Token")
        }

        req.user= user;
        next();

    // } catch (error) {
    //     throw new ApiError(401, error.message || "Invalid Access Token")
    // }
}