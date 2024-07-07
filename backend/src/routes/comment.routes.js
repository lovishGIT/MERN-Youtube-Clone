import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { AddComment, GetAllComments, RemoveComment, UpdateComment } from '../controllers/comment.controller.js';

const commentRouter= express.Router();

commentRouter.get("/getAll/:id", GetAllComments);

commentRouter.post("/add/:id", verifyJWT, AddComment);
commentRouter.patch("/update/:id", verifyJWT, UpdateComment);
commentRouter.delete("/remove/:id", verifyJWT, RemoveComment);


export default commentRouter;