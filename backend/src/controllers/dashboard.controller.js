import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrors.js";
import { Tweet } from "../models/tweet.model.js";

export const getChannelStats = asyncHandler(async (req, res) => {
    //  total video views.

    const user = req.user;

    const UserChannelStats = await User.aggregate([
        {
            $match: {
                _id: user._id,
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        }, // subs
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
            },
        }, // videos
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweets",
            },
        }, // tweets
        {
            $lookup: {
                from: "likes",
                localField: "videos._id",
                foreignField: "video",
                as: "Videolikes",
            },
        }, // Videolikes
        {
            $lookup: {
                from: "likes",
                localField: "tweets._id",
                foreignField: "tweet",
                as: "Tweetlikes",
            },
        }, // Tweetlikes
        {
            $addFields: {
                videosCount: { $size: "$videos" },
                tweetCount: { $size: "$tweets" },
                subscribersCount: { $size: "$subscribers" },
                videosWithLikes: {
                    $map: {
                        input: "$videos",
                        as: "video",
                        in: {
                            _id: "$$video._id",
                            likesCount: {
                                $size: {
                                    $filter: {
                                        input: "$Videolikes",
                                        cond: {
                                            $eq: [
                                                "$$this.video",
                                                "$$video._id",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                tweetsWithLikes: {
                    $map: {
                        input: "$tweets",
                        as: "tweet",
                        in: {
                            _id: "$$tweet._id",
                            likesCount: {
                                $size: {
                                    $filter: {
                                        input: "$Tweetlikes",
                                        cond: {
                                            $eq: [
                                                "$$this.tweet",
                                                "$$tweet._id",
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullName: 1,
                avatar: 1,
                createdAt: 1,
                subscribersCount: 1,
                videosCount: 1,
                videosWithLikes: 1,
                tweetCount: 1,
                tweetsWithLikes: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, UserChannelStats, "User Channel Stats Succesfully fetched"));
});

export const getChannelVideos = asyncHandler(async (req, res) => {
    const user = req.user;

    const allVideos = await Video.find({ owner: user._id });
    if (!allVideos) {
        return res.status(204);
    }
    return res
        .status(200)
        .json(new ApiResponse(200, allVideos, "All Videos Fetched."));
});

export const getChannelTweets = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Please Login.");
    }

    const allTweets = await Tweet.find({ owner: user._id });
    if (!allTweets) {
        return res.status(204);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, allTweets, "All Tweets Fetched."));
})