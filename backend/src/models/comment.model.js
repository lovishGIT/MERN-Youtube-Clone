import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema= new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    tag: [{
        type: String,
    }],
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true})

commentSchema.plugin(mongooseAggregatePaginate)
const Comment= mongoose.model("Comment", commentSchema);
export default Comment;