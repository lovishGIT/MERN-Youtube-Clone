import express from "express";
import { toggleSubscribe } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const subsRouter= express.Router()

subsRouter.post("/:username", verifyJWT, toggleSubscribe);

export default subsRouter;