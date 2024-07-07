import Playlist from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPlaylistById= asyncHandler(async(req, res)=> {
    let {playlistId}= req.params;
    if(!playlistId) {
        throw new ApiError(400, "Playlist Id not specified.")
    }

    const playlist= await Playlist.findById(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not Found.")
    }

    return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Successfully fetched Playlist"))
});

export const createPlaylist= asyncHandler(async(req, res)=> {
    const user= req.user;
    if(!user) {
        throw new ApiError(401, "Please Login.");
    }
    let {name, description}= req.body;
    if(!name || !description) {
        throw new ApiError(400, "name or description not specified.")
    }

    const playlist= await Playlist.create({
        name, description,
        owner: user._id,
    });

    return res
            .status(201)
            .json(new ApiResponse(201, playlist, "An Empty Playlist Created"));
});

export const updatePlaylist= asyncHandler(async(req, res)=> {
    let playlistId= req.params.playlistId;
    if(!playlistId) {
        throw new ApiError(400, "Playlist Id not specified.");
    }

    let {name, description}= req.body;
    if(!name && !description) {
        throw new ApiError(400, "Both fields cant be null.");
    }

    const playlist= await Playlist.findByIdAndUpdate(playlistId, 
        {
            $set: { name, description }
        }, {new: true}
    );
    if(!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Playlist Updated Successfully"))
});

export const addVideoToPlaylist= asyncHandler(async(req, res)=> {
    const {vidId, playlistId}= req.params;
    if(!vidId || !playlistId) {
        throw new ApiError(400, "Video or Playlist not selected.");
    }

    const video= await Video.findById(vidId);
    if(!video) {
        throw new ApiError(404, "video not found");
    }

    const playlist= await Playlist.findByIdAndUpdate(playlistId, 
        {
            $addToSet: {
                video: video._id,
            }
        },
        {new: true}
    );
    if(!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    return res
            .status(201)
            .json(new ApiResponse(201, playlist, "Video added to the playlist"));
});

export const removeVideoFromPlaylist= asyncHandler(async(req, res)=> {
    const {vidId, playlistId}= req.params;
    if(!vidId || !playlistId) {
        throw new ApiError(400, "Video or Playlist not selected.");
    }

    const video= await Video.findById(vidId);
    if(!video) {
        throw new ApiError(404, "video not found");
    }

    const playlist= await Playlist.findByIdAndUpdate(playlistId, 
        {
            $pull: {
                video: video._id,
            }
        }, 
        {new: true}
    );
    if(!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    return res
            .status(201)
            .json(new ApiResponse(201, playlist, "Video removed to the playlist"));
});

export const deletePlaylist= asyncHandler(async(req, res)=> {
    let {playlistId}= req.params;
    if(!playlistId) {
        throw new ApiError(400, "Playlist Id not specified.")
    }

    const playlist= await Playlist.findByIdAndDelete(playlistId);
    if(!playlist) {
        throw new ApiError(404, "Playlist not Found.")
    }

    return res
            .status(200)
            .json(new ApiResponse(200, playlist, "Successfully deleted Playlist"))
});