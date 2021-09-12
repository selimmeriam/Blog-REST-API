
const express     = require('express');
const cors        = require('cors');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const bodyParser= require('body-parser');
require('dotenv').config();
//this one is dublicated in the new express version 
//const bodyParser  = require('body-parser');



//connect to your database using the following syntax
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})



let app = express();
const port= process.env.PORT || 5000;
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
 //app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json());
/////////////////////////
//middleware for upload Images/files to server
app.use("/images", express.static(path.join(__dirname, "/images")));

///*********** How to handle Uploading Routine to the server ********* */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    //cb(null, "hello.png"); for only Postman testing reasons o.w you should use the below code 
    cb(null, req.body.name);
  },
});

//Endpoint for Uploading the images 
// i.e. http://localhost:5000/backend/upload
const upload = multer({ storage: storage });
app.post("/backend/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded...");
});

///////////////////////////////
/***********start of routes handle ***************/
//1)to serve the users routes go to users.js
const userRoute = require("./mern-blog/routes/users.js");


//2)to serve the posts routes go to posts.js
const postRoute = require("./mern-blog/routes/posts.js");

//3)to serve the authentication routes go to auth.js
const authRoute = require("./mern-blog/routes/auth.js");

//4)to serve the category routes go to category.js
const catRoute = require("./mern-blog/routes/category.js");

//if the user put after the route url/posts, all the postRoute will be loaded  
app.use("/posts", postRoute);

//if the user put after the route url/users all the userRoute will be loaded  
app.use("/users", userRoute);


//if the user put after the route url/auth all the authRoute will be loaded  
app.use("/auth", authRoute);

//if the user put after the route url/category all the authRoute will be loaded  
app.use("/category", catRoute);

/****************ends of routes handle *************/

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
