const router = require("express").Router();
const Auth = require("../middleware/Auth");
const Contacts = require("../models/contactSchema");
const Posts = require("../models/postSchema");
const Users = require("../models/userSchema");

router.post("/api/new-post", Auth, async (req, res) => {
    try {
        const { caption, desc, url } = req.body;
        const { user } = req
        if (!caption || !desc || !url) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const createPost = new Posts({
            caption,
            description: desc,
            image: url,
            user: user
        });

        await createPost.save();
        res.json({ message: "Post created successfully" });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/api/profile", Auth, async (req, res) => {
    try {
        const { user } = req;
        const posts = await Posts.find({ user: user._id });
        res.json({ posts, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/api/all-posts", Auth, async (req, res) => {
    try {
        const { user } = req;
        const posts = await Posts.find().populate("user", "_id username email").sort({ '_id': -1 });
        res.json({ posts, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/api/user", Auth, async (req, res) => {
    try {
        const { username } = req.query;
        const { user: follower } = req;
        const [user] = await Users.find({ username });
        const posts = await Posts.find({ user: user._id });
        const [isFollowed] = await Contacts.find({ follower: follower._id, followed: user._id });
        const userDetails = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        res.json({ posts, userDetails, isFollowed: !!isFollowed });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/api/like", Auth, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;

        if (!id) return res.status(400).json({ message: "User not found" });

        const updatedPost = await Posts.findOneAndUpdate({ _id: id }, {
            $push: { likes: user._id }
        }, { returnDocument: "after" }).populate("user", "_id username email");
        res.json({ updatedPost, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/api/unlike", Auth, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;

        if (!id) return res.status(400).json({ message: "User not found" });

        const updatedPost = await Posts.findOneAndUpdate({ _id: id }, {
            $pull: { likes: user._id }
        }, { returnDocument: "after" }).populate("user", "_id username email");
        res.json({ updatedPost, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/api/favourites", Auth, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;

        if (!id) return res.status(400).json({ message: "User not found" });

        const updatedPost = await Posts.findOneAndUpdate({ _id: id }, {
            $push: { favourites: user._id }
        }, { returnDocument: "after" }).populate("user", "_id username email");

        await Users.findOneAndUpdate({ _id: user._id }, {
            $push: { favourites: id }
        }, { returnDocument: "after" });

        res.json({ updatedPost, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/api/unfavourites", Auth, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;

        if (!id) return res.status(400).json({ message: "User not found" });

        const updatedPost = await Posts.findOneAndUpdate({ _id: id }, {
            $pull: { favourites: user._id }
        }, { returnDocument: "after" }).populate("user", "_id username email");

        await Users.findOneAndUpdate({ _id: user._id }, {
            $pull: { favourites: id }
        }, { returnDocument: "after" });

        res.json({ updatedPost, user });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/favourites", Auth, async (req, res) => {
    try {
        const { user } = req;
        const favPosts = await Posts.find({ _id: { $in: user.favourites } });
        res.json({ favPosts });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;