const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    followed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    }
});

const Contacts = new mongoose.model("CONTACT", contactSchema);

module.exports = Contacts;