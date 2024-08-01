import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { DeleteImageFromCloudinary, DeleteVideoFromCloudinary, UploadOnCloudinary } from "../utils/cloudinary.js";

export const publishVideo= asyncHandler(async(req, res)=> {
    // const {videoFile, thumbnail, title, description, views, likes, isPublished, owner} =
    const {title, description, isPublished} = req.body;

    const owner = req.user;
    const localVideoFilePath= req.files?.videoFile[0]?.path;
    const localThumbnailPath= req.files?.thumbnail[0]?.path;

    if( !title || !description || !owner || !localThumbnailPath || !localVideoFilePath) {
        console.log(title, description, isPublished, owner, localThumbnailPath, localVideoFilePath);
        throw new ApiError(400, "All Fields are required.");
    }

    const videoFile= await UploadOnCloudinary(localVideoFilePath);
    const thumbnail= await UploadOnCloudinary(localThumbnailPath);

    // console.log(VideoFile, Thumbnail);
    if(!videoFile || !thumbnail || !videoFile.duration) {
        DeleteImageFromCloudinary(videoFile);
        DeleteVideoFromCloudinary(thumbnail);
        throw new ApiError(500, "Video / thumbnail Uploading Error.");
    }

    const videoUpload= await Video.create({
        title, description, owner,
        videoFile: videoFile.url,
        duration: videoFile.duration,
        thumbnail: thumbnail.url,
        isPublished: isPublished || true,
    });

    return  res .status(201)
                .json(new ApiResponse(201, videoUpload, "Video Uploaded Successful"));


});

export const getAllVideos= asyncHandler(async(req, res)=> {
    let {username, userId,
        page= 1, limit= 10, query="", sortBy= "_id", sortType= "asc"
    } = req.query;
    const ownerUser= await User.findOne(
        {$or: [{username}, {_id: userId}]}
    );
    if(!ownerUser) {
        throw new ApiError(404, "User Not Found with that Username");
    }

    const AllVideos= await Video.aggregate([
        {
            $search: {
                index: "searchVideos", // made a search index via Atlas Search Index
                text: {
                    query: query,
                    path: {
                        wildcard: "*"
                    }
                }
            }
        }, {
            $match: {
                $and: [{owner: ownerUser._id}, {isPublished: true}]
            },
        }, {
            $sort: {
                [sortBy]: sortType == "asc" ? 1 : -1,
            }
        }, {
            $skip: (page - 1) * limit,
            // if page 2, so (2-1)* 10= 10
            // 10 videos will be skipped
        }, {
            $limit: limit
        },
    ])

    if(!AllVideos) {
        return res.status(200).end("No Content to be displayed.");
    }
    return res
            .status(200)
            // .json(new ApiResponse(200, AllVideos, {numberOfVideos}, "Videos fetched Successfully."));
            .json(new ApiResponse(200, AllVideos, "Videos fetched Successfully."));
}); // Implemented Atlas Search Index

export const getVideoById= asyncHandler(async(req, res)=> {
    const {id}= req.params;
    if(!id || mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Id or Id not specified")
    }
    const video= await Video.findById(id);
    if(!video || !video.isPublished) {
        throw new ApiError(404, "Video not Found with such id.");
    }
    video.views = video.views + 1;
    await video.save();
    return res
            .status(200)
            .json(new ApiResponse(200, video, "Enjoy The Video."));
}); // In future, likes, comments, etc.

export const getRandomlyVideos = asyncHandler(async (req, res) => {
    let {
        page = 1,
        limit = 10,
        query,
        sortBy = "_id",
        sortType = "asc",
    } = req.query;
    let AllVideos;
    if (!query) {
        AllVideos = await Video.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            {
                $addFields: {
                    userAvatar: {
                        $arrayElemAt: ["$userInfo.avatar", 0],
                    },
                    userName: {
                        $arrayElemAt: ["$userInfo.username", 0],
                    },
                },
            },
            {
                $project: {
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    duration: 1,
                    views: 1,
                    likes: 1,
                    createdAt: 1,
                    userName: 1,
                    userAvatar: 1,
                },
            },
            {
                $sort: {
                    [sortBy]: sortType == "asc" ? 1 : -1,
                },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ]);
    } else {
        AllVideos = await Video.aggregate([
            {
                $search: {
                    index: "searchVideos", // Atlas Search Index
                    text: {
                        query: query,
                        path: {
                            wildcard: "*",
                        },
                    },
                },
            },
            {
                $sort: {
                    [sortBy]: sortType == "asc" ? 1 : -1,
                },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ]);
    }
    if (!AllVideos) {
        return res.status(200).end("No Content to be displayed.");
    }
    return (
        res .status(200)
            .json(
                new ApiResponse(200, AllVideos, "Videos fetched Successfully.")
            )
    );
});

export const togglePublish= asyncHandler(async(req, res)=> {
    const reqId= req.params?.id;
    if(!reqId) {
        throw new ApiError(400, "Please provide what video to be published or unpublished.");
    }
    if(!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

    const video= await Video.findByIdAndUpdate(reqId, [{
        $set: {
            isPublished: {
                $not: "$isPublished"
            }
        }
    }], {
        new: true,
    })

    if(!video) {
        throw new ApiError(404, "Video not Found");
    }

    // console.log(video);

    return res
            .status(200)
            .json(new ApiResponse(200, video, `Successfully ${video.isPublished ? "P":"Unp"}ublished`));

})

export const updateVideo= asyncHandler(async(req, res)=> {
    const user= req.user;
    if(!user) {
        throw new ApiError(401, "Please login");
    }
    const video= await Video.findById(req.params.id);
    if(!video) {
        throw new ApiError(404, "Video Not Found. Please provide a valid Id.");
    }
    console.log(video.owner, user._id);
    if(video.owner.toString().toLowerCase().trim() !== user._id.toString().toLowerCase().trim()) {
        throw new ApiError(403, "Login via Owner's credentials to perform this action.")
    }

    console.log(req.body);
    const {title, description} = req.body;
    const localThumbnailPath= req.files?.thumbnail[0]?.path;
    if(!title && !description && !localThumbnailPath) {
        throw new ApiError(400, "No Updates specified.");
    }

    if(title) video.title= title;
    if(description) video.description= description;
    if(localThumbnailPath) {
        const newThumbnail= await UploadOnCloudinary(localThumbnailPath);
        if(newThumbnail?.url) video.thumbnail= newThumbnail.url;
    }

    await video.save();
    return res
            .status(200)
            .json(new ApiResponse(200, video, "Video Updated Successfully."))
});

export const DeleteVideoById= asyncHandler(async(req, res)=> {
    const user= req.user;
    if(!user) {
        throw new ApiError("Please Login");
    }

    const video= await Video.findOneAndDelete({_id: req.params?.id, owner: user._id});
    if(!video) {
        throw new ApiError(404,"Video Not Found in your profile.");
    }

    await DeleteVideoFromCloudinary(video.videoFile);
    await DeleteImageFromCloudinary(video.thumbnail);

    return res
            .status(204)
            .json(new ApiResponse(204, video, "Succesfully Deleted"));
});