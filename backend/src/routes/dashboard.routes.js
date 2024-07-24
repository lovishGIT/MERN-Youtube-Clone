import express from "express";
import { getChannelStats, getChannelTweets, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", verifyJWT, getChannelStats);
dashboardRouter.get("/videos", verifyJWT, getChannelVideos);
dashboardRouter.get("/tweets", verifyJWT, getChannelTweets);

export default dashboardRouter;