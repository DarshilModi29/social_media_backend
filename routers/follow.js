const router = require("express").Router();
const Auth = require("../middleware/Auth");
const Contacts = require("../models/contactSchema");
const Users = require("../models/userSchema");

router.post("/api/follow", Auth, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        if (!id) return res.status(400).json({ message: "User not found" });

        const [followedUser] = await Users.find({ _id: id });
        const followUser = new Contacts({
            follower: user,
            followed: followedUser._id
        });

        await followUser.save();
        res.status(200).json({ message: "Followed", isFollowed: true });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/api/unfollow", Auth, async (req, res) => {
    try {
        const { id } = req.body;
        const { user } = req;
        if (!id) return res.status(400).json({ message: "User not found" });

        await Contacts.deleteOne({ follower: user._id, followed: id });
        res.status(200).json({ message: "Unfollowed", isFollowed: false });
    } catch (error) {
        console.log(error.toString());
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;