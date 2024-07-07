import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { ToggleLikeComment, ToggleLikeTweet, ToggleLikeVideo, getLikedVideos } from '../controllers/like.controller.js';

const likeRouter= express.Router();

likeRouter.get("/LikedVideos", verifyJWT, getLikedVideos);

likeRouter.post("/toggle/video/:id", verifyJWT, ToggleLikeVideo);
likeRouter.post("/toggle/comment/:id", verifyJWT, ToggleLikeComment);
likeRouter.post("/toggle/tweet/:id", verifyJWT, ToggleLikeTweet);


export default likeRouter;