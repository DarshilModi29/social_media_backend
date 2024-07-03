//required modules
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//import routers
const userRouter = require("./routers/users");
const postRouter = require("./routers/posts");

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