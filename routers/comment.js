const Comments = require("../models/commentSchema");
const router = require("express").Router();
const Auth = require("../middleware/Auth");
const Posts = require("../models/postSchema");

router.post("/add-comment", Auth, async (req, res) => {
    try {
        const { comment, postId } = req.body;
        const { user } = req;

        const newComment = new Comments({ comment, postId, username: user.username });
        await newComment.save();
        await Posts.findByIdAndUpdate({ _id: postId }, { $inc: { comments: 1 } });

        res.json({ message: "Comment posted succesfully", newComment });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/comments", Auth, async (req, res) => {
    try {
        const { postId } = req.query;
        const { user } = req;
        const data = await Comments.find({ postId });
        res.json({ data, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/update-comment", Auth, async (req, res) => {
    try {
        const { comment_id } = req.query;
        const { comment } = req.body;
        const newComment = await Comments.findByIdAndUpdate({ _id: comment_id }, { comment }, { returnDocument: "after" });
        res.json({ message: "Comment Updated succesfully", newComment });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/delete-comment", Auth, async (req, res) => {
    try {
        const { comment_id } = req.query;
        const { postId } = req.body;
        await Comments.findByIdAndDelete({ _id: comment_id });
        await Posts.findByIdAndUpdate({ _id: postId }, { $inc: { comments: -1 } });
        res.json({ message: "Comment Deleted succesfully" });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;
