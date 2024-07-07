import Comment from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const GetAllComments= asyncHandler(async(req, res)=> {
    let id= req.params.id;
    const video= await Video.findById(id);
    if(!video || !video.isPublished) {
        throw new ApiError(404, "Video Not Found.")
    }
    const allComments= await Comment.aggregate([
        {
            $match: {video: video._id}, //new mongoose.Types.ObjectId is not used because we are directly accessing _id only.
        }, {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
                pipeline: [
                    {
                        $group: {_id: "$comment", count: {$sum: 1}}
                    }
                ]
            }
        }, {
            $project: {
                _id: 1,
                content: 1,
                tag: 1,
                owner: 1,
                likes: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ]);

    // console.log(allComments);
    return res     
            .status(200)
            .json(new ApiResponse(200, allComments, { numberOfComments: allComments.length }, "Comments fetched succesfully"));
});

export const AddComment= asyncHandler(async(req, res)=> {
    let content= req.body.content;
    const videoId= req.params?.id;
    const user= req.user;

    content= content.trim();
    // console.log(content);
    if(!content) {
        throw new ApiError(400, "Empty comment field");
    }
    if(!user) {
        throw new ApiError(401, "Please Login.");
    } 
    if(!videoId) {
        throw new ApiError(403, "Commenting Without Video Id is prohibited.");
    }

    
    let commentDetails= {
        content: content, 
        video: videoId,
        owner: user._id,
        tag: [],
    }
    
    let video= await Video.findById(videoId);
    if(!video) {
        throw new ApiError(404, "Video Not Found");
    }
    if(video?.owner.toString() == user?._id.toString()) {
        commentDetails.tag.push("Author");
    } else if(!video?.isPublished) {
        throw new ApiError(401, "Only Authors can comment on an unpublished videos.");
    }
    
    const comment= await Comment.create(commentDetails);
    if(!comment) {
        throw new ApiError(500, "Something went wrong while posting the comment.")
    }

    return res
            .status(201)
            .json(new ApiResponse(201, comment, "Comment has been added"));
});

export const UpdateComment= asyncHandler(async(req, res)=> {
    let {content}= req.body;
    let commentId= req.params.id;
    let user= req.user;
    if(!content) {
        throw new ApiError(400, "Empty Comment Error.");
    }
    if(!commentId) {
        throw new ApiError(400, "Comment Not Selected.");
    }
    if(!user) {
        throw new ApiError(401, "Please Login.");
    }

    const comment= await Comment.findByIdAndUpdate({_id: commentId, owner: user._id}, {
        content,
        $addToSet:{
            tag: "Edited",
        },
    }, {new: true}).select("-__v");
    if(!comment) {
        throw new ApiError(404, "Your Comment not Found.");
    } 

    return res
            .status(200)
            .json(new ApiResponse(200, comment, "Comment Updated Successfully"));

}) // only comment's owner

export const RemoveComment= asyncHandler(async(req, res)=> {
    const user = req.user;
    if(!user) {
        throw new ApiError(401, "Please Login");
    }

    const {id}= req.params;
    const comment= await Comment.findById(id).select("-__v");
    if(!comment) {
        throw new ApiError(404, "Comment not found!");
    }

    const video= await Video.findById(comment.video)
    if(user._id.toString() !== comment.owner.toString() || user._id.toString() !== video.owner.toString()) {
        throw new ApiError(401, "You cant delete this comment.");
    }

    await Comment.findByIdAndDelete(comment._id);

    return res  
            .status(200)
            .json(new ApiResponse(200, comment, "Comment Deleted Successfully"))


}); // both video's owner and comment's owner