import Subscription from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const toggleSubscribe= asyncHandler(async(req, res)=> {

    // logged in hoga
    const subscriber= req.user;
    if(!subscriber) {
        throw new ApiError(401, "Please Log In.");
    }
    
    // params se subscribe krwado
    const channel= await User.findOne({username: req.params.username});
    if(!channel) {
        throw new ApiError(400, "Channel Name not Specified.");
    }
    
    if(subscriber == channel) {
        throw new ApiError(400, "Cant subscribe yourself.");
    }
    // console.log(subscriber._id + " to " + channel._id);

    const existedSubscription= await Subscription.findOne({
        $and: {subscriber: subscriber._id, channel: channel._id},
    });
    if(existedSubscription) {
        await Subscription.findByIdAndDelete(existedSubscription._id);
        return res.status(202).json(new ApiResponse(200, "Removed Subscription."))
    }

    // console.log(subscriber._id + " to " + channel._id);

    const createdSubscription= await Subscription.create({
        subscriber: subscriber._id, 
        channel: channel._id,
    });
    if(!createdSubscription) {
        throw new ApiError(500, "Someting went wrong! Try Again");
    }

    return res.status(202).json(new ApiResponse(200, "Added Subscription."));
});

