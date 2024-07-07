const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "POST"
    },
    username: {
        type: String,
        ref: "USER"
    },
    comment: {
        type: String,
    },
}, { timestamps: true });

const Comments = new mongoose.model("COMMENT", commentSchema);

module.exports = Comments;