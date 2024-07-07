import mongoose, { Schema } from "mongoose";

const likeSchema= new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    }, 
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
    // one out of three.
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, {timestamps: true})

const Like= mongoose.model("Like", likeSchema);
export default Like;