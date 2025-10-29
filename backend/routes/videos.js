import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set storage to upload directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "Avarri",
    resource_type: "video",
  },
});

const upload = multer({ storage });

// Upload video route
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    const videoUrl = req.file.path;

    // Example MongoDB entry (optional)
    // await Video.create({ title, url: videoUrl });

    res.json({
      message: "Video uploaded successfully!",
      title,
      url: videoUrl,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;
// ✅ GET all uploaded videos
router.get("/", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  const uploadDir = path.join(__dirname, "../../uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Failed to read uploads" });
    }

    const videos = files.map((filename) => ({
      name: filename,
      url: `/uploads/${filename}`,
    }));

    res.json(videos);
  });
});
