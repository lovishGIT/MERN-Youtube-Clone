import mongoose from "mongoose";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { DeleteFromCloudinary, UploadOnCloudinary } from "../utils/cloudinary.js";
import { getAccessAndRefreshTokens } from "../utils/generateTokens.js"

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const registerUser = asyncHandler(async (req, res)=>{
    
    // console.log(req.body);
    const {fullName, email, username, password}= req.body;
    // why this is better??
    // by this only necessary data will be taken

    if( [fullName, email, username, password].some((field) => field?.trim() == "")) { // checking if any value is empty.
        throw new ApiError(400, "Please fill all the details.");
    }
    
    // const findUserByusername= await User.findOne({username: username}) 
    // const findUserByemail= await User.findOne({email: email}) 
    
    const findUser= await User.findOne({
        $or: [{username}, {email}]
    })

    // if(findUserByusername?.username || findUserByemail?.email){
    if(findUser){
        throw new ApiError(409, "User already exists. Please Login");
    } 
    
    const finalUser = {
        username: username?.toLowerCase(),
        fullName, 
        email, 
        password,
    }

    // console.log(req?.files);
    // console.log(req?.files?.avatar[0]?.path);

    const avatarLocalpath = req.files?.avatar[0]?.path;
    let coverImageLocalpath;
    if(req.files?.coverImage) 
        coverImageLocalpath = req.files?.coverImage[0]?.path;

    // Since Avatar is Compulsary.
    // if(avatarLocalpath) { 
        const avatar= await UploadOnCloudinary(avatarLocalpath);
        if(!avatar) throw new ApiError(500, "Error Uploading Avatar.")
        finalUser.avatar= avatar.url;
    // }

    if(coverImageLocalpath) {
        const coverImage= await UploadOnCloudinary(coverImageLocalpath);
        if(!coverImage) throw new ApiError(500, "Error Uploading Cover Image.")
        finalUser.coverImage= coverImage.url;
    }

    
    const user= await User.create(finalUser);
    console.log(user);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    return res.status(200).json(new ApiResponse(
        200, createdUser, "User Registered Successfully." 
    ))

});

export const loginUser = asyncHandler(async(req, res)=>{
    // login details 
    // email / username 
    // password

    // give him access token with acess token expiry.
    // give him refresh token with refresh token expiry.
    // token in form of cookies
    
    const {username, email, password}= req.body;
    if(!username && !email) {
        console.log(req.body);
        throw new ApiError(400, `Either Username or Email is required for Authentication.`);
    }

    let existedUser= await User.findOne({
        $or: [{username}, {email}]
    });
    if(!existedUser) {
        throw new ApiError(401, "User Not Found!");
    }

    if(!await existedUser.isPasswordCorrect(password)) {
        throw new ApiError(401, "Authentication Failed! Invalid Password.")
    }

    // after this we want to access newly updated user. So we have to access him again in db.
    // Generally getting data via id is faster. So, i saved Id here.

    let saveId= existedUser._id; 
    const {accessToken, refreshToken}= await getAccessAndRefreshTokens(saveId);

    existedUser= await User.findById(saveId).select("-password -refreshToken");

    const options= {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
              .cookie("accessToken", accessToken, options)
              .cookie("refreshToken", refreshToken, options)
              .json(new ApiResponse(
                200, {
                    user: existedUser, accessToken, refreshToken
                }, 
                "User Logged In Successfully"
              ));

});

export const logoutUser= async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1, // by this refresh token is removed
            }
            // $set: {
            //     refreshToken: uundefined, // by this refresh token was not removed
            // }
        }, {
            new: true,
        }
    )

    const options= {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
              .clearCookie("accessToken", options)
              .clearCookie("refreshToken", options)
              .json(new ApiResponse(200, {}, "User Logged Out Successfully."));

};

export const refreshAccessToken= asyncHandler(async(req, res)=>{
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken) {
            throw new ApiError(401, "UnAuthorized Request.")
        }
    
        const decodedToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user= await User.findById(decodedToken?._id);
        if(!user) {
            throw new ApiError(401, "Invalid Refresh Token.")
        }
        const newAccessToken= await user.generateAccessToken();
        const options= {
            httpOnly: true,
            secure: true
        }
    
        res.set(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", incomingRefreshToken, options)
            .json(new ApiResponse(200, {
                accessToken: newAccessToken, refreshToken: incomingRefreshToken
            },
            "Access Token Refreshed."
        ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token");
    }

});

export const changeCurrentPassword= asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body;

    const existedUser= await User.findById(req.user?._id);

    const checkPassword= await existedUser.isPasswordCorrect(oldPassword);
    if(!checkPassword) {
        throw new ApiError(400, "Invalid Password");
    }

    existedUser.password= newPassword;
    await existedUser.save();

    return res.status(200)
              .json(new ApiResponse(200, "Password Changed Succesfull."));
});

export const getCurrentUser= asyncHandler(async(req,res)=> {
    if(!req?.user) {
        throw new ApiError(401, "User must be Logged In.")
    }
    return res.status(200)
              .json(new ApiResponse(200, req.user, "User Fetched Successfully."));
});

export const updateAccountDetails= asyncHandler(async(req, res)=>{
    const {fullName, email} = req.body;
    if(!fullName || !email) {
        throw new ApiError(400, "All Fields are required.")
    }

    const newUser= await User.findByIdAndUpdate(req.user?._id, 
        {
            $set: {fullName, email},
            // es6 syntax fullName: fullName is equivalent to fullName.
        },
        {new: true}
    ).select("-password -refreshToken")

    return res.status(200)
              .json(new ApiResponse(200, newUser, "User Updated Successfully."))
});

export const updateUserAvatar= asyncHandler(async(req, res)=>{
    const avatarLocalPath= req.file?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Files not Specified.");
    }

    const newAvatar= await UploadOnCloudinary(avatarLocalPath);
    if(!newAvatar?.url) {
        throw new ApiError(500, "File Uploading Error.");
    }

    // Delete Old URL
    await DeleteFromCloudinary(req.user?.avatar);

    const newUser= await User.findByIdAndUpdate(req.user?._id, 
        {
            $set: {avatar: newAvatar.url}
        },
        {new: true}
    ).select("-password -refreshToken")

    return res.status(200)
              .json(new ApiResponse(200, newUser, "Avatar Updated Successfully."))
});

export const updateUserCoverImage= asyncHandler(async(req, res)=>{
    const coverImageLocalPath= req.file?.path;
    if(!coverImageLocalPath) {
        throw new ApiError(400, "File not Specified.");
    }

    const newCoverImage= await UploadOnCloudinary(coverImageLocalPath);
    if(!newCoverImage?.url) {
        throw new ApiError(500, "File Uploading Error.");
    }

    if(req.user?.coverImage) {
        await DeleteFromCloudinary(req.user.coverImage);
    }

    const newUser= await User.findByIdAndUpdate(req.user?._id, 
        {
            $set: {coverImage: newCoverImage.url}
        },
        {new: true}
    ).select("-password -refreshToken")

    return res.status(200)
              .json(new ApiResponse(200, newUser, "Cover Image Updated Successfully."))
});

export const getUserChannelProfile= asyncHandler(async(req, res)=> {
    // if u want to visit a channel, Example You go to https://www.youtube.com/@chaiaurcode
    // this chaiaurcode is a channel name.
    
    // console.log(req.params);
    // console.log(req.cookies.refreshToken);

    const existingUserToken= req.cookies.refreshToken || req.body.refreshToken
    const existingUserId= await User.findOne({
        refreshToken: existingUserToken || "",
    })

    let {username} = req.params;
    username= username?.trim();
    if(!username) {
        throw new ApiError(400, "Username is Missing.");
    }

    // console.log(existingUserId._id, username);

    const channel= await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase(),
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            }
        }, {
            $addFields: {
                subscribersCount: {$size: "$subscribers"},
                subscribedToCount: {$size: "$subscribedTo"},
                isSubscribed: {$cond: {
                    if: {$in: [existingUserId._id, "$subscribers.subscriber"]},
                    then: true,
                    else: false,
                }}
            }
        }, {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                createdAt: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
            }
        }
    ])
    if(!channel?.length) {
        throw new ApiError(404, "channel doesn't exists")
    }
    // console.log(channel);

    return res.status(200)
              .json(new ApiResponse(200, channel[0], "User Channel Fetched Successfully."));

});

export const getWatchHistory= asyncHandler(async(req, res)=> {
    const user= await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id),
            }
        }, 
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{
                                $project: {
                                    _id: 1,
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1,
                                } // Selected fullname and username and avatar only.
                            }],
                        }
                    }, // video ka owner nikala
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            }
                        }
                    }, // since array return krega to only first owner nikalke object dedo
                ],
            },
        }, 
    ])

    return res.status(200)
              .json(new ApiResponse(200, user[0].watchHistory, "Watch History fetched Successfully."))

});
