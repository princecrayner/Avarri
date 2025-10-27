// backend/routes/videos.js
const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary video storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avarri_uploads",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "mkv", "avi"],
  },
});

// Multer upload settings
const upload = multer({
  storage,
  limits: { fileSize: 2000 * 1024 * 1024 }, // up to ~2GB
});

// Upload route
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    res.json({
      success: true,
      title,
      url: file.path,
      public_id: file.filename,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ success: false, message: "Video upload failed" });
  }
});

module.exports = router; // ✅ export router
