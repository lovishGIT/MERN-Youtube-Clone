import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { AddVideoComment, AddTweetComment, GetAllTweetComments, GetAllVideoComments, RemoveComment, UpdateComment } from '../controllers/comment.controller.js';

const commentRouter= express.Router();

commentRouter.get("/video/getAll/:id", GetAllVideoComments);
commentRouter.get("/tweet/getAll/:id", GetAllTweetComments);

commentRouter.post("/video/add/:id", verifyJWT, AddVideoComment);
commentRouter.post("/tweet/add/:id", verifyJWT, AddTweetComment);

commentRouter.patch("/update/:id", verifyJWT, UpdateComment);
commentRouter.delete("/remove/:id", verifyJWT, RemoveComment);


export default commentRouter;