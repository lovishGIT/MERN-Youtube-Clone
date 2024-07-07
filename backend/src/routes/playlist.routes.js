import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, removeVideoFromPlaylist, updatePlaylist } from '../controllers/playlist.controller.js';

const playlistRouter= express.Router();


playlistRouter.post("/create", verifyJWT, createPlaylist);

playlistRouter.get("/:playlistId", getPlaylistById)
playlistRouter.patch("/update/:playlistId", verifyJWT, updatePlaylist);
playlistRouter.delete("/delete/:playlistId", verifyJWT, deletePlaylist);

playlistRouter.patch("/add/:vidId/:playlistId", verifyJWT, addVideoToPlaylist);
playlistRouter.patch("/remove/:vidId/:playlistId", verifyJWT, removeVideoFromPlaylist);      

export default playlistRouter;