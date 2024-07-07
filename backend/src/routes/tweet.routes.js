import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { deleteTweet, getUserTweets, postNewTweet, updateTweet } from '../controllers/tweet.controller.js';

const tweetRouter= express.Router();

tweetRouter.get("/getAllTweets/:id", getUserTweets);

tweetRouter.post("/postTweet", verifyJWT, postNewTweet);
tweetRouter.patch("/update/:id", verifyJWT, updateTweet);
tweetRouter.delete("/delete/:id", verifyJWT, deleteTweet);


export default tweetRouter;