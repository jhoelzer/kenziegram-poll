const express = require("express");
const multer = require("multer");
const fs = require("fs");

const publicPath = "public/";
const uploadPath = './public/uploads/';
const cssLink = `<link rel="stylesheet" type="text/css" media="screen" href="style.css" />`
const port = 3000;
let modTime = 0;

const app = express();
app.use(express.static(publicPath));
app.use(express.json());
const upload = multer({ dest: uploadPath });

app.set("view engine", "pug");

const uploadedFiles = [];

function displayImages (imageNames) {
    let outputString = "";
    for (let i = 0; i < imageNames.length; i++) {
        const name = imageNames[i];
        console.log(name);
        outputString += `${cssLink} <img src="uploads/${name}" id="images" />`;
    }
    return outputString;
}

app.get("/", function (req, res) {
    fs.readdir(uploadPath, function(err, items) {
        console.log(items);
        res.render("getPug", {items});
    });
})

app.post("/uploads", upload.single("myFile"), function (req, res) {
    // request.file is the `myFile` file
    // request.body will hold the text fields, if there were any
    let newImage = "uploads/" + req.file.filename
    console.log("Uploaded: " + newImage);
    uploadedFiles.push(newImage);
    res.render("postPug", {newImage});
});

app.post("/latest", (req, res) => {
    let newArray = [];

    fs.readdir(uploadPath, (err, items) => {
        let clientTime = req.body.after;
        let highestTime = 0
        items.forEach((value) => {
            const modTime = fs.statSync(`${uploadPath}/${value}`).mtimeMs;
            if (modTime > clientTime) {
                newArray.push(`${uploadPath}/${value}`);
            }
            if (modTime > highestTime) {
                highestTime = modTime;
            }
        })
        res.status(200);
        res.send({ images: newArray, timeStamp: highestTime })
    })
})

app.listen(port, console.log("Listening on port " + port));