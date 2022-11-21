const express = require("express");
const multer = require("multer");
const app = express();
const PORT = 5000;

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

app.post("/upload", upload.single("image"), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Successfully uploaded",
        fileUrl: req.file.filename
    })
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})