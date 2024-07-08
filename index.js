//required modules
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//import routers
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");
const contactRouter = require("./routers/follow");
const commentRouter = require("./routers/comment");

//port and other variables
const port = process.env.PORT || 8000;

//some utility for data transfering 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//use routers
app.use(userRouter);
app.use(postRouter);
app.use(contactRouter);
app.use(commentRouter);

//Database Connection
require("./db/connection");

// routers
app.get("/", (req, res) => {
    res.send("Hello World");
});

// server connection
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})