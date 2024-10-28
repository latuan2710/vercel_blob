const { put } = require("@vercel/blob");
const express = require("express");
const multer = require("multer");
const app = express();

require('dotenv').config();

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).single("myFile");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (req.file == undefined) {
      return res.status(400).send({ message: "No file selected!" });
    }

    const file = req.file;

    const blob = await put("", file.buffer, {
      access: "public",
      multipart: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "image/png",
    });

    res.json(blob);
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
