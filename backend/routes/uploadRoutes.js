import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Video from "../models/Video.js"; // We’ll create this model

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a video
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const newVideo = new Video({
      title: req.body.title || "Untitled Video",
      filePath: `/uploads/${req.file.filename}`,
      views: 0,
      likes: 0,
      comments: [],
    });

    await newVideo.save();
    res.json(newVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

// Get all videos
router.get("/", async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

// Like a video
router.post("/:id/like", async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });

  video.likes += 1;
  await video.save();
  res.json(video);
});

// Add a comment
router.post("/:id/comment", async (req, res) => {
  const { text } = req.body;
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });

  video.comments.push(text);
  await video.save();
  res.json(video);
});

export default router;
