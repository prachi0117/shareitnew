const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
dotenv.config();
const useRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const multer = require("multer")
const path = require("path");
const cors = require('cors');
const router = express.Router();


mongoose.connect('mongodb://localhost:27017/socialapp', {
})
.then(() => {
     console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
// app.use(cors({
//     origin: 'http://localhost:3000', // Your frontend URL
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type']
//   }));
app.use(express.json());
app.use(helmet())
app.use(morgan("comman"))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

const upload = multer({storage});
app.post("/api/upload", upload.single("file"),(req,res) =>{
    try{
        return res.status(200).json("File uploaded successfully.")

    }catch(err){
        console.error('Upload error:', err);
        res.status(500).json('Error uploading file.');

    }

})

app.use("/api/users",useRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);


app.get('/' , (req,res) => {
    res.send("helo");
})

app.listen(8800, () =>{
    console.log("Backend server is running");
})