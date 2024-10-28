const { put, list, del } = require("@vercel/blob");
const express = require("express");
const multer = require("multer");
const app = express();

require("dotenv").config();
app.use(express.json());

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).single("myFile");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/list", async (req, res) => {
  const urls = await list();
  res.json(urls);
});

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

    const blob = await put(originalName, file.buffer, {
      access: "public",
      multipart: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "image/png",
    });

    res.json(blob);
  });
});

app.delete("/delete", async (req, res) => {
  const fileUrl = req.body.fileUrl;

  try {
    await del(fileUrl);
    res.json({ message: "Delete Successfull!" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error!" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
