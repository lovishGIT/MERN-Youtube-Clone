import { User } from "../models/user.model.js";
import { ApiError } from "./apiErrors.js";

export const getAccessAndRefreshTokens= async (userId) => {
    // try {
        const existedUser= await User.findById(userId);
        const accessToken= await existedUser.generateAccessToken();
        const refreshToken= await existedUser.generateRefreshToken();

        existedUser.refreshToken= refreshToken;
        await existedUser.save( {validateBeforeSave: false} );
        // console.log(accessToken,"\n", refreshToken);
        return {accessToken, refreshToken};
    // } catch (error) {
    //     throw new ApiError(error?.status || 500, error?.message || "Something went wrong while generating Tokens.");
    // }
}