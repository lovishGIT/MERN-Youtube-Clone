import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app= express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        optionsSuccessStatus: 200,
        // credentials: true,
    })
); //cors

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}));

app.use(express.static("public"));
app.use(cookieParser());

// Routers
import userRouter from "./routes/user.routes.js";
import subsRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/video" , videoRouter);
app.use("/api/v1/subscription", subsRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter);


import { heathCheck } from "./controllers/healthcheck.controller.js";
app.get("/api/v1/health", heathCheck);

export {app};