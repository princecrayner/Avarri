// backend/routes/videos.js

import express from "express";
import multer from "multer"; // ✅ Make sure multer is imported
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avarri_uploads",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "mkv", "avi"],
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 2000 * 1024 * 1024 }, // up to ~2GB
});

// POST route for uploading video
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const result = req.file;
    const { title } = req.body;

    res.json({
      success: true,
      title,
      url: result.path,
      public_id: result.filename,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "Video upload failed" });
  }
});

export default router;
