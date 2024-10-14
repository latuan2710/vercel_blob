const { put } = require("@vercel/blob");
const express = require("express");
const multer = require("multer");
const app = express();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).single("myFile");

app.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (req.file == undefined) {
      return res.status(400).send({ message: "No file selected!" });
    }

    const originalName = req.body.fileName;

    const file = req.file;

    const blob = await put(originalName, file.buffer.toString(), {
      access: "public",
    });

    res.json(blob);
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
