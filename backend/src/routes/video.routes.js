import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { DeleteVideoById, getAllVideos, getRandomlyVideos, getVideoById, publishVideo, togglePublish, updateVideo } from '../controllers/video.controller.js';

const videoRouter= express.Router();

videoRouter.get("/watch?:id", getVideoById);
videoRouter.get("/channel", getAllVideos);
videoRouter.get("/random", getRandomlyVideos);

// secured routes
videoRouter.post("/upload", verifyJWT,  upload.fields([{
        name: "videoFile",
        maxCount: 1,
    }, {
        name: "thumbnail",
        maxCount: 1,
    }
]), publishVideo);

videoRouter.post("/togglePublish/:id", verifyJWT, togglePublish);
videoRouter.patch("/update/:id", verifyJWT, upload.single("thumbnail"), updateVideo);
videoRouter.post("/DeleteVideo/:id", verifyJWT, DeleteVideoById)

export default videoRouter;