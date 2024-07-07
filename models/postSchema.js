const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    caption: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USER"
        }
    ],
    favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USER"
        }
    ],
    comments: {
        type: Number
    }
}, { timestamps: true });

const Posts = new mongoose.model("POST", postSchema);

module.exports = Posts;