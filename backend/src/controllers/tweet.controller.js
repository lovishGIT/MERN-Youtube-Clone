import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const postNewTweet= asyncHandler(async(req, res)=> {
    const user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login.");
    }

    let {content}= req.body;
    content= content?.trim();
    if(!content) {
        throw new ApiError(400, "Content cant be empty.");
    }

    const tweet= await Tweet.create({
        content,
        owner: user._id,
    });
    if(!tweet) {
        throw new ApiError(500, "Uploading Tweet Error.");
    }

    return res
            .status(201)
            .json(new ApiResponse(201, tweet, "New Tweet Tweeted"));
});

export const getUserTweets = asyncHandler(async (req, res) => {
    let userId= req.params.id;
    if(!userId) {
        throw new ApiError(400, "No user mentionned.");
    }

    let user= await User.findById(userId);

    // let tweets= await Tweet.find({owner: userId});
    let tweets= await Tweet.aggregate([
        {
            $match: {owner: user._id}
        }, {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likes",
                pipeline: [
                    {
                        $group: { _id: "$tweet", count: { $sum: 1 }}
                    }
                ]
            }
        }
    ]);
    // console.log(tweets);
    return res
            .status(200)
            .json(new ApiResponse(200, tweets, "All Tweets Fetched."));   
});

export const updateTweet = asyncHandler(async (req, res) => {
    const user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login.");
    }

    let tweetId= req.params.id;

    let {content}= req.body;
    content= content?.trim();
    if(!content) {
        throw new ApiError(400, "Content cant be empty.");
    }

    const tweet= await Tweet.findByIdAndUpdate(tweetId, {
        content,
    }, {new: true}).select("-__v");
    if(!tweet) {
        throw new ApiError(404, "No Such Tweet Id.");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, tweet, "Tweet Updated."));
});

export const deleteTweet = asyncHandler(async (req, res) => {
    const user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login.");
    }

    let tweetId= req.params.id;
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(404, "Invalid Object Id.")
    }

    const tweet= await Tweet.findByIdAndDelete(tweetId).select("-__v");
    if(!tweet) {
        throw new ApiError(404, "Tweet Not Found.");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, tweet, "Tweet Deleted."));
});