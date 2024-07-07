import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { ToggleLikeComment, ToggleLikeTweet, ToggleLikeVideo, getLikedVideos } from '../controllers/like.controller.js';

const likeRouter= express.Router();

likeRouter.post("/video/:id", verifyJWT, ToggleLikeVideo);
likeRouter.post("/comment/:id", verifyJWT, ToggleLikeComment);
likeRouter.post("/tweet/:id", verifyJWT, ToggleLikeTweet);
likeRouter.get("/LikedVideos", verifyJWT, getLikedVideos);


export default likeRouter;