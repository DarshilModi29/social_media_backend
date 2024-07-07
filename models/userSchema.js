const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    favourites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USER"
        }
    ]
}, { timestamps: true });

const Users = new mongoose.model("USER", userSchema);

module.exports = Users;