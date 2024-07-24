import express from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter= express.Router();

userRouter.post("/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]), registerUser);

userRouter.post("/login", loginUser);
userRouter.get("/get-channel/:username", getUserChannelProfile);

// secured Routes
userRouter.post("/logout", verifyJWT, logoutUser);
userRouter.post("/refersh-token", refreshAccessToken);

userRouter.patch("/change-password", verifyJWT, changeCurrentPassword);
userRouter.patch("/update-details", verifyJWT, updateAccountDetails);
userRouter.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
userRouter.patch("/cover-image", verifyJWT, upload.single("coverImage"), updateUserCoverImage);

userRouter.get("/", verifyJWT, getCurrentUser);
userRouter.get("/history", verifyJWT, getWatchHistory);

export default userRouter;