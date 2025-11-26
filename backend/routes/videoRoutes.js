import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Video from "../models/Video.js";

// Multer setup
const upload = multer({ dest: "uploads/" });

// Cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const router = express.Router();

// Upload video
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const uploadedVideo = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: "video"
    });

    const newVideo = new Video({
      title: req.body.title,
      description: req.body.description,
      url: uploadedVideo.secure_url
    });

    await newVideo.save();

    res.json({ success: true, video: newVideo });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// Get all videos
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to load videos" });
  }
});

export default router;
