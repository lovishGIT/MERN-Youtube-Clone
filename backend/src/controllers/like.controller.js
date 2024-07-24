import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const ToggleLikeVideo= asyncHandler(async(req, res)=> {
    let videoId= req.params.id;
    const video= await Video.findById(videoId);
    if(!video) {
        throw new ApiError("Video Not Found");
    }

    let user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login");
    }

    // console.log(video.owner.toString(), user._id.toString());

    if(video.owner.toString() === user._id.toString()) {
        throw new ApiError(403, "You cant post likes on your video.");
    }

    let status;
    let like= await Like.findOne({
        video: videoId,
        likedBy: user._id,
    })
    if(!like) {
        like= await Like.create({
            video: videoId,
            likedBy: user._id,
        });
        status= 201;
    } else {
        like= await Like.findByIdAndDelete(like._id).select("-__v");
        status= 200;
    }

    return res
            .status(status)
            .json(new ApiResponse(status, like, `Video ${status == 201 ? "" : "Un"}Liked`));
});

export const ToggleLikeComment= asyncHandler(async(req, res)=> {
    let commentId= req.params.id;
    const comment= await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError("Comment Not Found");
    }

    let user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login");
    }

    if(comment.owner.toString() == user._id.toString()) {
        throw new ApiError(403, "You cant post likes on your comment.");
    }

    const tweetOrVideo = await Video.findOne({ _id: comment.video }) ?? await Tweet.findOne({ _id: comment.tweet });
    if (user._id.toString() == tweetOrVideo.owner.toString()) {
        comment.tag.push("Liked by Author");
        // const authorAvatar = await User.findById(user._id).select("avatar");
    }

    let status;
    let like= await Like.findOne({
        comment: commentId,
        likedBy: user._id,
    })
    if(!like) {
        like= await Like.create({
            comment: commentId,
            likedBy: user._id,
        });
        status= 201;
    } else {
        like= await Like.findByIdAndDelete(like._id).select(" -__v");
        status= 200;
    }

    return res
            .status(status)
            .json(new ApiResponse(status, like, `Comment ${status == 201 ? "" : "Un"}Liked`));
}); // sending author avatar id a todo

export const ToggleLikeTweet= asyncHandler(async(req, res)=> {
    let tweetId= req.params.id;
    const tweet= await Tweet.findById(tweetId);
    if(!tweet) {
        throw new ApiError("Tweet Not Found");
    }

    let user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login");
    }

    if(tweet.owner.toString() == user._id.toString()) {
        throw new ApiError(403, "You cant post likes on your tweet.");
    }

    let status;
    let like= await Like.findOne({
        tweet: tweetId,
        likedBy: user._id,
    })
    if(!like) {
        like= await Like.create({
            tweet: tweetId,
            likedBy: user._id,
        });
        status= 201;
    } else {
        like= await Like.findByIdAndDelete(like._id).select(" -__v");
        status= 200;
    }

    return res
            .status(status)
            .json(new ApiResponse(status, like, `Tweet ${status == 201 ? "" : "Un"}Liked`));
});

export const getLikedVideos= asyncHandler(async(req, res)=> {
    const user= req.user;

    const allVideos= await Like.aggregate([
        {
            $match: {likedBy: user._id} //new mongoose.Types.ObjectId is not used because we are directly accessing _id only.
        }, {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
            }
        },
    ]);
    // console.log(allVideos);

    return res
            .status(200)
            .json(new ApiResponse(200, allVideos, "All Liked Videos Fetched Successfully."));
});