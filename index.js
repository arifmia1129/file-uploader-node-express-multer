const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/file-upload")
        console.log("DB Connected")
    } catch (error) {
        console.log(error.message);
    }
}

const userSchema = mongoose.Schema({
    name: String,
    image: String
})

const User = mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running successfully"
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/users/')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        cb(null, name)
    }
})

const upload = multer({ storage: storage })

app.get("/upload", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/upload", upload.single("image"), async (req, res) => {

    const user = new User({
        name: req.body.name,
        image: req.file.filename
    })

    await user.save()

    res.status(200).json({
        success: true,
        message: "Successfully uploaded",
        user
    })
})

app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await dbConnect()
})