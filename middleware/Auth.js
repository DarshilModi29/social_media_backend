const jwt = require("jsonwebtoken");
const Users = require("../models/userSchema");
const { default: mongoose } = require("mongoose");

const auth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [bearer, token] = authorization?.split(' ');
        if (!authorization || !token) {
            return res.status(401).json({ "message": "Access Denied" });
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let userId = new mongoose.Types.ObjectId(verifyToken.id);
        const user = await Users.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.toString());
        return res.status(500).json({ "message": "Internal Server Error" });
    }
}

module.exports = auth;