const express = require("express");
const app = express();
const path = require("path");
const fileUpload = require('express-fileupload');
const filesPayloadExist = require("./middleware/filesPayloadExist");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post('/upload', 
    fileUpload({ createParentPath: true }),
    filesPayloadExist,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files;
        console.log(files)

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({status : 'logged', message: 'logged'})
    }
)
 
app.listen(PORT, () => console.log(`Shellback running on port ${PORT}`));