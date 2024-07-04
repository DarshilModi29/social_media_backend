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

module.exports = router;